import { evaluateFormula, handleError, Result, Sex } from "@shared";
import { AnthropometricVariableObject } from "../common";
import {
  Indicator,
  GrowthReferenceChart,
  GrowthStandard,
  GrowthReferenceTable,
} from "../models";
import { IZScoreCalculationService } from "./interfaces/ZScoreCalculationService";
import { ZScoreComputingStrategy } from "../policies/interfaces/ZScoreComputingStrategy";
import { GROWTH_INDICATOR_ERRORS, handleGrowthIndicatorError } from "../errors";

export class ZScoreCalculationService implements IZScoreCalculationService {
  constructor(private readonly strategies: ZScoreComputingStrategy[]) {}

  private findStrategy(
    indicator: Indicator,
    standard: GrowthStandard
  ): ZScoreComputingStrategy | undefined {
    return this.strategies.find(
      strategy =>
        strategy.type === indicator.getZScoreComputingStrategyType() &&
        strategy.standard === standard
    );
  }
  async calculateZScore<T extends GrowthReferenceChart | GrowthReferenceTable>(
    data: AnthropometricVariableObject,
    indicator: Indicator,
    growthRef: T,
    standard: GrowthStandard
  ): Promise<
    Result<{ zScore: number; computedValue: [xAxis: number, yAxis: number] }>
  > {
    try {
      const strategy = this.findStrategy(indicator, standard);
      if (!strategy) {
        return handleGrowthIndicatorError(
          GROWTH_INDICATOR_ERRORS.CALCULATION.STRATEGY_NOT_FOUND.path,
          `Indicator: ${indicator.getCode()} , Standard: ${standard}`
        );
      }
      const axeX = evaluateFormula(indicator.getAxeX().value, data) as number;
      const axeY = evaluateFormula(indicator.getAxeY().value, data) as number;
      const zscore = strategy.computeZScore<T>({
        measurements: { x: axeX, y: axeY },
        growthReference: growthRef,
        sex: data.sex as Sex,
      });
      if (isNaN(zscore)) {
        return handleGrowthIndicatorError(
          GROWTH_INDICATOR_ERRORS.CALCULATION.INVALID_RESULT.path,
          `ZScore : ${zscore}, Indicator: ${indicator.getCode()}, GrowthRef: ${growthRef.getCode()}, Standard: ${standard}`
        );
      }
      return Result.ok({
        zScore: zscore,
        computedValue: [axeX, axeY],
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
