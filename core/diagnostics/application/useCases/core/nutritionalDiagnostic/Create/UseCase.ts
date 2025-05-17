import { AggregateID, Factory, handleError, left, Result, right, UseCase } from "@shared";
import { CreateNutritionalDiagnosticRequest } from "./Request";
import { CreateNutritionalDiagnosticResponse } from "./Response";
import { CreateNutritionalDiagnosticProps, NutritionalDiagnostic, NutritionalDiagnosticRepository, PatientACL } from "../../../../../domain";

export class CreateNutritionalDiagnosticUseCase implements UseCase<CreateNutritionalDiagnosticRequest, CreateNutritionalDiagnosticResponse> {
   constructor(
      private readonly nutritionalDiagnosticFactory: Factory<CreateNutritionalDiagnosticProps, NutritionalDiagnostic>,
      private readonly repo: NutritionalDiagnosticRepository,
      private readonly patientACL: PatientACL,
   ) {}
   async execute(request: CreateNutritionalDiagnosticRequest): Promise<CreateNutritionalDiagnosticResponse> {
      try {
         const patientValidationResult = await this.checkIfIsValidPatient(request.patientId);
         if (patientValidationResult.isFailure) return left(patientValidationResult);
         const nutritionalDiagnostic = await this.nutritionalDiagnosticFactory.create(request);
         if (nutritionalDiagnostic.isFailure) return left(nutritionalDiagnostic);
         nutritionalDiagnostic.val.created();
         await this.repo.save(nutritionalDiagnostic.val);
         return right(Result.ok({ id: nutritionalDiagnostic.val.id }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private async checkIfIsValidPatient(patientId: AggregateID): Promise<Result<boolean>> {
      try {
         const patient = await this.patientACL.getPatientInfo(patientId);
         if (!patient) return Result.fail("Patient Not found. Please the diagnostic must be create for an existing patient");
         return Result.ok(true);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
