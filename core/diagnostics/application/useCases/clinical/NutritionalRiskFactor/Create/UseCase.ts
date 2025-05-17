import { GenerateUniqueId, handleError, left, Result, right, SystemCode, UseCase, ValueType } from "@shared";
import { CreateNutritionalRiskFactorRequest } from "./Request";
import { CreateNutritionalRiskFactorResponse } from "./Response";
import { ClinicalSignReferenceRepository, NutritionalRiskFactor, NutritionalRiskFactorRepository } from "../../../../../domain";

export class CreateNutritionalRiskFactorUseCase implements UseCase<CreateNutritionalRiskFactorRequest, CreateNutritionalRiskFactorResponse> {
   constructor(
      private readonly idGenerator: GenerateUniqueId,
      private readonly nutritionalRiskFactorRepo: NutritionalRiskFactorRepository,
      private readonly clinicalRefRepo: ClinicalSignReferenceRepository,
   ) {}
   async execute(request: CreateNutritionalRiskFactorRequest): Promise<CreateNutritionalRiskFactorResponse> {
      try {
         const checkRes = await this.checkIsValidClinicalCode(request);
         if (checkRes.isFailure) return left(checkRes);
         const nutritionalRiskId = this.idGenerator.generate().toValue();
         const nutritionalRiskFactorRes = NutritionalRiskFactor.create(request.data, nutritionalRiskId);
         if (nutritionalRiskFactorRes.isFailure) return left(nutritionalRiskFactorRes);
         nutritionalRiskFactorRes.val.created();
         await this.nutritionalRiskFactorRepo.save(nutritionalRiskFactorRes.val);
         return right(Result.ok({ id: nutritionalRiskId }));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   async checkIsValidClinicalCode(request: CreateNutritionalRiskFactorRequest): Promise<Result<ValueType>> {
      try {
         const clinicalSignRefCodes = await this.clinicalRefRepo.getAllCode();
         const nutritionalRiskFactorCode = SystemCode.create(request.data.clinicalSignCode);
         if (nutritionalRiskFactorCode.isFailure) return nutritionalRiskFactorCode;
         const findResult = clinicalSignRefCodes.find((clinicalRefCode) => clinicalRefCode.equals(nutritionalRiskFactorCode.val));
         if (!findResult) return Result.fail("The code of nutritional risk factor is not correspond to any clinicalSignReference on a system.");
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
