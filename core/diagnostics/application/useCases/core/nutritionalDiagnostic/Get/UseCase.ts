import { ApplicationMapper, handleError, left, Result, right, UseCase } from "@shared";
import { GetNutritionalDiagnosticRequest } from "./Request";
import { GetNutritionalDiagnosticResponse } from "./Response";
import { NutritionalDiagnostic, NutritionalDiagnosticRepository } from "../../../../../domain";
import { NutritionalDiagnosticDto } from "../../../../dtos";

export class GetNutritionalDiagnosticUseCase implements UseCase<GetNutritionalDiagnosticRequest, GetNutritionalDiagnosticResponse> {
   constructor(
      private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
      private readonly mapper: ApplicationMapper<NutritionalDiagnostic, NutritionalDiagnosticDto>,
   ) {}
   async execute(request: GetNutritionalDiagnosticRequest): Promise<GetNutritionalDiagnosticResponse> {
      try {
         const nutritionalDiagnostics = [];
         if (request.nutritionalDiagnosticId && !request.patientId) {
            nutritionalDiagnostics.push(await this.nutritionalDiagnosticRepo.getById(request.nutritionalDiagnosticId));
         } else if (request.patientId && !request.nutritionalDiagnosticId) {
            nutritionalDiagnostics.push(await this.nutritionalDiagnosticRepo.getByPatient(request.patientId))
         } else {
            // CHECK: Verifier si c'est bien judicieux de le faire de la sorte ou bien de retourner tout
            nutritionalDiagnostics.push();
         }
         return right(Result.ok(nutritionalDiagnostics.map(this.mapper.toResponse)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
