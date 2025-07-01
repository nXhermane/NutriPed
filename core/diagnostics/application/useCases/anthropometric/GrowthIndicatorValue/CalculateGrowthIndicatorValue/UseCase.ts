import {
  formatError,
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@shared";
import { CalculateGrowthIndicatorValueRequest } from "./Request";
import { CalculateGrowthIndicatorValueResponse } from "./Response";
import {
  AnthropometricData,
  AnthropometricVariableObject,
  CreateAnthropometricData,
  DAY_IN_YEARS,
  EvaluationContext,
  GrowthIndicatorValue,
  IAnthropometricValidationService,
  IAnthropometricVariableGeneratorService,
  IGrowthIndicatorService,
  ValidateResult,
} from "./../../../../../domain";

export class CalculateGrowthIndicatorValueUseCase
  implements
    UseCase<
      CalculateGrowthIndicatorValueRequest,
      CalculateGrowthIndicatorValueResponse
    >
{
  constructor(
    private readonly anthropometricValidationService: IAnthropometricValidationService,
    private readonly anthropometricVariablesService: IAnthropometricVariableGeneratorService,
    private readonly growthIndicatorService: IGrowthIndicatorService
  ) {}
  async execute(
    request: CalculateGrowthIndicatorValueRequest
  ): Promise<CalculateGrowthIndicatorValueResponse> {
    try {
      const evaluationContext = this.getEvaluationContext(request);
      const anthropometricDataRes = this.createAnthropometricData(
        request.anthropometricData
      );
      if (anthropometricDataRes.isFailure) {
        return left(anthropometricDataRes);
      }
      const validationRes = await this.validateAnthropometricData(
        anthropometricDataRes.val,
        evaluationContext
      );
      if (validationRes.isFailure) {
        return left(validationRes);
      }
      const anthropometricVariablesRes =
        await this.generateAnthropometricVariableObject(
          anthropometricDataRes.val,
          evaluationContext
        );
      if (anthropometricVariablesRes.isFailure) {
        return left(anthropometricVariablesRes);
      }
      const growthIndicatorValueRes = await this.calculateGrowthIndicatorValue(
        anthropometricVariablesRes.val,
        request.indicatorCode
      );

      if (growthIndicatorValueRes.isFailure) {
        return left(growthIndicatorValueRes);
      }

      const anthropometricVariablesIncludeIndicatorValue =
        await this.generateAnthropometricVariableObject(
          anthropometricDataRes.val,
          evaluationContext,
          [growthIndicatorValueRes.val]
        );

      if (anthropometricVariablesIncludeIndicatorValue.isFailure) {
        return left(anthropometricVariablesIncludeIndicatorValue);
      }
      const {
        code,
        growthStandard,
        interpretation,
        isValid,
        referenceSource,
        unit,
        value,
        valueRange,
        computedValue,
      } = growthIndicatorValueRes.val.unpack();

      return right(
        Result.ok({
          variables: anthropometricVariablesIncludeIndicatorValue.val,
          growthIndicatorValue: {
            code: code.unpack(),
            growthStandard: growthStandard,
            interpretation: interpretation,
            isValid: isValid,
            referenceSource: referenceSource,
            unit: unit.unpack(),
            value: value,
            valueRange: valueRange,
            computedValue,
          },
        })
      );
    } catch (e) {
      return left(handleError(e));
    }
  }

  private async calculateGrowthIndicatorValue(
    data: AnthropometricVariableObject,
    indicatorCode: string
  ): Promise<Result<GrowthIndicatorValue>> {
    try {
      const indicatorCodeRes = SystemCode.create(indicatorCode);
      if (indicatorCodeRes.isFailure) {
        return Result.fail(
          formatError(
            indicatorCodeRes,
            CalculateGrowthIndicatorValueUseCase.name
          )
        );
      }
      return this.growthIndicatorService.calculateIndicator(
        data,
        indicatorCodeRes.val
      );
    } catch (e) {
      return handleError(e);
    }
  }
  private async generateAnthropometricVariableObject(
    anthropometricData: AnthropometricData,
    evaluationContext: EvaluationContext,
    growthIndicatorValues?: GrowthIndicatorValue[]
  ) {
    return this.anthropometricVariablesService.generate(
      anthropometricData,
      evaluationContext,
      growthIndicatorValues
    );
  }
  private async validateAnthropometricData(
    anthropometricData: AnthropometricData,
    evaluationContext: EvaluationContext
  ): Promise<Result<ValidateResult>> {
    return this.anthropometricValidationService.validate(
      anthropometricData,
      evaluationContext
    );
  }

  private getEvaluationContext(
    request: CalculateGrowthIndicatorValueRequest
  ): EvaluationContext {
    return {
      age_in_day: request.age_in_day,
      age_in_month: request.age_in_month,
      age_in_year: request.age_in_day / DAY_IN_YEARS,
      sex: request.sex,
    };
  }

  private createAnthropometricData(
    anthropometricProps: CreateAnthropometricData
  ): Result<AnthropometricData> {
    return AnthropometricData.create(anthropometricProps);
  }
}
