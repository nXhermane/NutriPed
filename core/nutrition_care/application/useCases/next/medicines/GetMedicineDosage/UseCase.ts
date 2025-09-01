import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { GetMedicineDosageRequest } from "./Request";
import { GetMedicineDosageResponse } from "./Response";
import { NextNutritionCare } from "@/core/nutrition_care/domain";
import { NextMedicinesDto } from "@/core/nutrition_care/application/dtos";

export class GetMedicineDosageUseCase
  implements UseCase<GetMedicineDosageRequest, GetMedicineDosageResponse>
{
  constructor(
    private readonly calculator: NextNutritionCare.IMedicationDosageCalculator,
    private readonly mapper: ApplicationMapper<
      NextNutritionCare.MedicationDosageResult,
      NextMedicinesDto.MedicationDosageResultDto
    >
  ) {}
  async execute(
    request: GetMedicineDosageRequest
  ): Promise<GetMedicineDosageResponse> {
    try {
      const codeRes = SystemCode.create(request.code);
      if (codeRes.isFailure) return left(codeRes);
      const dosageRes = await this.calculator.calculate(
        codeRes.val,
        request.context
      );
      if (dosageRes.isFailure) return left(dosageRes);

      return right(Result.ok(this.mapper.toResponse(dosageRes.val)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
