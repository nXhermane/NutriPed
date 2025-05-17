import { ApplicationMapper, handleError, left, Result, right, UnitCode, UseCase } from "@shared";
import { UpdateAnthropometricMeasureRequest } from "./Request";
import { UpdateAnthropometricMeasureResponse } from "./Response";
import { AnthropometricMeasure, AnthropometricMeasureRepository, ValidationRule } from "../../../../../domain";
import { AnthropometricMeasureDto } from "../../../../dtos";

export class UpdateAnthropometricMeasureUseCase implements UseCase<UpdateAnthropometricMeasureRequest, UpdateAnthropometricMeasureResponse> {
   constructor(
      private readonly anthropometricMeasureRepo: AnthropometricMeasureRepository,
      private readonly mapper: ApplicationMapper<AnthropometricMeasure, AnthropometricMeasureDto>,
   ) {}
   async execute(request: UpdateAnthropometricMeasureRequest): Promise<UpdateAnthropometricMeasureResponse> {
      try {
         const anthropometricMeasure = await this.anthropometricMeasureRepo.getById(request.id);
         const updatedRes = this.updateAnthropometricMeasure(anthropometricMeasure, request.data);
         if (updatedRes.isFailure) return left(updatedRes);
         await this.anthropometricMeasureRepo.save(anthropometricMeasure);
         return right(Result.ok(this.mapper.toResponse(anthropometricMeasure)));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }

   private updateAnthropometricMeasure(measure: AnthropometricMeasure, data: UpdateAnthropometricMeasureRequest["data"]): Result<unknown> {
      try {
         if (data.name) {
            measure.changeName(data.name);
         }
         if (data.unit && data.availableUnit) {
            const defaultUnit = UnitCode.create(data.unit);
            const availableUnits = data.availableUnit.map(UnitCode.create);
            const combinedRes = Result.combine([defaultUnit, ...availableUnits]);
            if (combinedRes.isFailure) return combinedRes;
            measure.changeUnits({ defaultUnit: defaultUnit.val, availableUnits: availableUnits.map((res) => res.val) });
         }
         if (data.validationRules) {
            const validationRules = data.validationRules.map(ValidationRule.create);
            const combinedRes = Result.combine(validationRules);
            if (combinedRes.isFailure) return combinedRes;
            measure.changeValidationRules(validationRules.map((res) => res.val));
         }
         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
