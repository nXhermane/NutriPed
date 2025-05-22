import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
  ValueType,
} from "@shared";
import { UpdateNutritionalRiskFactorRequest } from "./Request";
import { UpdateNutritionalRiskFactorResponse } from "./Response";
import {
  Condition,
  NutrientImpact,
  NutritionalRiskFactor,
  NutritionalRiskFactorRepository,
  RecommendedTest,
} from "../../../../../domain";
import { NutritionalRiskFactorDto } from "../../../../dtos";

export class UpdateNutritionalRiskFactorUseCase
  implements
    UseCase<
      UpdateNutritionalRiskFactorRequest,
      UpdateNutritionalRiskFactorResponse
    >
{
  constructor(
    private readonly repo: NutritionalRiskFactorRepository,
    private readonly mapper: ApplicationMapper<
      NutritionalRiskFactor,
      NutritionalRiskFactorDto
    >
  ) {}
  async execute(
    request: UpdateNutritionalRiskFactorRequest
  ): Promise<UpdateNutritionalRiskFactorResponse> {
    try {
      const nutritionalRiskFactor = await this.repo.getById(request.id);
      const updatedResult = this.updateNutritionalRiskFactor(
        nutritionalRiskFactor,
        request.data
      );
      if (updatedResult.isFailure) return left(updatedResult);
      await this.repo.save(nutritionalRiskFactor);
      return right(Result.ok(this.mapper.toResponse(nutritionalRiskFactor)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private updateNutritionalRiskFactor(
    nutritionalRisk: NutritionalRiskFactor,
    data: UpdateNutritionalRiskFactorRequest["data"]
  ): Result<ValueType> {
    try {
      if (data.clinicalSignCode) {
        const systemCode = SystemCode.create(data.clinicalSignCode);
        if (systemCode.isFailure) return systemCode;
        nutritionalRisk.changeClinicalSignCode(systemCode.val);
      }
      if (data.modulatingCondition) {
        const conditionRes = Condition.create(data.modulatingCondition);
        if (conditionRes.isFailure) return conditionRes;
        nutritionalRisk.changeModulatingCondition(conditionRes.val);
      }
      if (data.recommendedTests) {
        const recommendedTestRes = data.recommendedTests.map(
          RecommendedTest.create
        );
        const combinedRes = Result.combine(recommendedTestRes);
        if (combinedRes.isFailure) return combinedRes;
        nutritionalRisk.changeRecommendedTests(
          recommendedTestRes.map(res => res.val)
        );
      }
      if (data.associatedNutrients) {
        const nutrientImpactsRes = data.associatedNutrients.map(
          NutrientImpact.create
        );
        const combinedRes = Result.combine(nutrientImpactsRes);
        if (combinedRes.isFailure) return combinedRes;
        nutritionalRisk.changeAssociatedNutrients(
          nutrientImpactsRes.map(res => res.val)
        );
      }
      return Result.ok();
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
