import {
  handleError,
  left,
  Result,
  right,
  SystemCode,
  UseCase,
} from "@/core/shared";
import { CalculateAllAvailableGrowthIndicatorValueRequest } from "./Request";
import { CalculateAllAvailableGrowthIndicatorValueResponse } from "./Response";
import {
  AnthropometricData,
  AnthropometricVariableObject,
  AnthroSystemCodes,
  CreateAnthropometricData,
  DAY_IN_YEARS,
  EvaluationContext,
  GrowthIndicatorValue,
  IAnthropometricValidationService,
  IAnthropometricVariableGeneratorService,
  IGrowthIndicatorService,
  ValidateResult,
} from "../../../../../domain";
import { GrowthIndicatorValueDto } from "../../../../dtos";

export class CalculateAllAvailableGrowthIndicatorValueUseCase
  implements
    UseCase<
      CalculateAllAvailableGrowthIndicatorValueRequest,
      CalculateAllAvailableGrowthIndicatorValueResponse
    >
{
  constructor(
    private readonly anthropometricValidationService: IAnthropometricValidationService,
    private readonly anthropometricVariablesService: IAnthropometricVariableGeneratorService,
    private readonly growthIndicatorService: IGrowthIndicatorService
  ) {}
  async execute(
    request: CalculateAllAvailableGrowthIndicatorValueRequest
  ): Promise<CalculateAllAvailableGrowthIndicatorValueResponse> {
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
      const growthIndicatorValuesRes =
        await this.calculateGrowthIndicatorValues(
          anthropometricVariablesRes.val
        );
      if (growthIndicatorValuesRes.isFailure) {
        return left(growthIndicatorValuesRes);
      }
      const growthIndicatorValueDtos: GrowthIndicatorValueDto[] =
        growthIndicatorValuesRes.val.map(growthIndicatorValue => {
          const { code, unit, ...otherProps } = growthIndicatorValue.unpack();
          return {
            code: code.unpack(),
            unit: unit.unpack(),
            ...otherProps,
          };
        });
      return right(Result.ok(growthIndicatorValueDtos));
    } catch (e) {
      return left(handleError(e));
    }
  }

  private async calculateGrowthIndicatorValues(
    data: AnthropometricVariableObject
  ): Promise<Result<GrowthIndicatorValue[]>> {
    return this.growthIndicatorService.calculateAllIndicators(data);
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
  private getEvaluationContext(
    request: CalculateAllAvailableGrowthIndicatorValueRequest
  ): EvaluationContext {
    return {
      [AnthroSystemCodes.AGE_IN_MONTH]: request[AnthroSystemCodes.AGE_IN_MONTH],
      [AnthroSystemCodes.AGE_IN_DAY]: request[AnthroSystemCodes.AGE_IN_DAY],
      age_in_year: request.age_in_day / DAY_IN_YEARS,
      [AnthroSystemCodes.SEX]: request[AnthroSystemCodes.SEX],
    };
  }
  private createAnthropometricData(
    anthropometricProps: CreateAnthropometricData
  ): Result<AnthropometricData> {
    return AnthropometricData.create(anthropometricProps);
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
}
