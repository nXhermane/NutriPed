/**
 * @fileoverview Service for managing and calculating anthropometric growth indicators
 * using standardized growth references like WHO standards.
 * @module GrowthIndicatorService
 */

import {
  ConditionResult,
  evaluateCondition,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@shared";
import {
  Indicator,
  AnthropometricMeasure,
  GrowthIndicatorValue,
  GrowthStandard,
  CreateGrowthIndicatorValueProps,
  StandardShape,
  GrowthRefChartAndTableCodes,
} from "../models";
import {
  AnthropometricMeasureRepository,
  IndicatorRepository,
  IGrowthIndicatorService,
} from "../ports";
import { AnthropometricVariableObject } from "../common";
import { IReferenceSelectionService } from "./interfaces/GrowthReferenceSelectionService";
import { IZScoreCalculationService } from "./interfaces/ZScoreCalculationService";
import { IZScoreInterpretationService } from "./interfaces/ZScoreInterpretationService";

/**
 * @class GrowthIndicatorService
 * @implements {IGrowthIndicatorService}
 * @description Handles the computation and management of growth indicators for anthropometric measurements.
 * Provides functionality to:
 * - Identify applicable growth indicators for given measurements
 * - Calculate z-scores using different computing strategies
 * - Interpret growth measurements against standard references
 */
export class GrowthIndicatorService implements IGrowthIndicatorService {
  /**
   * @constructor
   * @param {AnthropometricMeasureRepository} anthropometricMeasureRepo - Access to anthropometric measure definitions
   * @param {IndicatorRepository} indicatorRepo - Access to growth indicator definitions and formulas
   * @param {GrowthReferenceChartRepository} growthChartRepo - Access to reference growth charts and standards
   * @param {ZScoreComputingStrategy[]} zScoreComputingStrategies - Available strategies for z-score computation
   */
  constructor(
    private anthropometricMeasureRepo: AnthropometricMeasureRepository,
    private indicatorRepo: IndicatorRepository,
    private growthReferenceSelectionService: IReferenceSelectionService,
    private zScoreService: IZScoreCalculationService,
    private interpretationService: IZScoreInterpretationService
  ) {}

  /**
   * @method identifyPossibleIndicator
   * @async
   * @param {AnthropometricVariableObject} data - Object containing available anthropometric measurements
   * @returns {Promise<Result<Indicator[]>>} Array of indicators that can be calculated
   * @description
   * Analyzes available measurements to determine which growth indicators can be calculated.
   * The process involves:
   * 1. Getting all registered indicators
   * 2. Checking if required measurements are available
   * 3. Validating usage conditions for each indicator
   */
  async identifyPossibleIndicator(
    data: AnthropometricVariableObject
  ): Promise<Result<Indicator[]>> {
    try {
      const indicators = await this.indicatorRepo.getAll();
      const anthropDataMeasureCodes = Object.keys(data);
      const possibleIndicators: Indicator[] = [];
      for (const indicator of indicators) {
        const neededMeasureCodes = indicator.getMeasureCodes();
        const isPossible = neededMeasureCodes.every(code =>
          anthropDataMeasureCodes.includes(code)
        );
        if (isPossible) {
          const usageCondition = indicator.getUsageCondition();
          const conditionResult =
            evaluateCondition<AnthropometricVariableObject>(
              usageCondition.value,
              data
            );
          if (ConditionResult.True === conditionResult)
            possibleIndicators.push(indicator);
        }
        // anthropometric Data dispose des mesures necessaires pour utiliser cet Indicateur
        // Verifions maintenant si le context est bon

        // const variableNames = usageCondition.variables;
        // if (
        //   !variableNames.every(variableName =>
        //     anthropDataMeasureCodes.includes(variableName)
        //   )
        // ) {
        //   return Result.fail(
        //     "The context don't contain all needed variables"
        //   );
        // }
      }
      return Result.ok(possibleIndicators);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * @method getRequireMeasureForIndicator
   * @async
   * @param {SystemCode} indicatorCode - Unique identifier for the indicator
   * @returns {Promise<Result<AnthropometricMeasure[]>>} List of required measurements
   * @description Retrieves all anthropometric measurements needed to calculate a specific indicator
   */
  async getRequireMeasureForIndicator(
    indicatorCode: SystemCode
  ): Promise<Result<AnthropometricMeasure[]>> {
    try {
      const indicator = await this.indicatorRepo.getByCode(indicatorCode);
      const neededMeasureCodes = indicator.getProps().neededMeasureCodes;
      const anthropometricMeasures = await Promise.all(
        neededMeasureCodes.map(code =>
          this.anthropometricMeasureRepo.getByCode(code)
        )
      );
      return Result.ok(anthropometricMeasures);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * @method calculateIndicator
   * @async
   * @param {AnthropometricVariableObject} data - Available anthropometric measurements
   * @param {SystemCode} indicatorCode - Indicator to calculate
   * @param {GrowthStandard} [standard=GrowthStandard.OMS] - Growth standard reference to use
   * @returns {Promise<Result<GrowthIndicatorValue>>} Calculated indicator with interpretation
   * @description
   * Calculates a specific growth indicator using provided measurements.
   * Process includes:
   * 1. Validating measurement availability
   * 2. Computing z-score
   * 3. Determining interpretation based on z-score
   */
  async calculateIndicator(
    data: AnthropometricVariableObject,
    indicatorCode: SystemCode,
    standard: GrowthStandard = GrowthStandard.OMS
  ): Promise<Result<GrowthIndicatorValue>> {
    try {
      const possibleIndicators = await this.identifyPossibleIndicator(data);
      if (possibleIndicators.isFailure)
        return Result.fail(
          formatError(possibleIndicators, GrowthIndicatorService.name)
        );
      const indicator = possibleIndicators.val.find(
        indicator => indicator.getCode() === indicatorCode.unpack()
      );
      if (!indicator)
        return Result.fail(
          `On ne peut pas calculer cette indicateur (${indicatorCode})pour ce patient`
        );
      return await this._calculateIndicator(data, indicator, standard);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * @method calculateAllIndicators
   * @async
   * @param {AnthropometricVariableObject} data - Available anthropometric measurements
   * @param {GrowthStandard} [standard=GrowthStandard.OMS] - Growth standard reference to use
   * @returns {Promise<Result<GrowthIndicatorValue[]>>} Array of calculated indicators
   * @description
   * Calculates all possible growth indicators for given measurements.
   * Automatically determines which indicators can be calculated based on available data.
   */
  async calculateAllIndicators(
    data: AnthropometricVariableObject,
    standard: GrowthStandard = GrowthStandard.OMS
  ): Promise<Result<GrowthIndicatorValue[]>> {
    try {
      const possibleIndicators = await this.identifyPossibleIndicator(data);
      if (possibleIndicators.isFailure)
        return Result.fail(
          formatError(possibleIndicators, GrowthIndicatorService.name)
        );
      const growthIndicatorValueRes = await Promise.all(
        possibleIndicators.val.map(indicator =>
          this._calculateIndicator(data, indicator, standard)
        )
      );
      // FIXME:
      // BETA: Je dois faire des verife plustard. pour les growth inicator non calculer.
      const computedIndicators = growthIndicatorValueRes.filter(
        res => res.isSuccess
      );

      return Result.ok(computedIndicators.map(res => res.val));
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * @method _calculateIndicator
   * @private
   * @async
   * @param {AnthropometricVariableObject} data - Anthropometric measurements
   * @param {Indicator} indicator - Indicator definition to calculate
   * @param {GrowthStandard} [standard=GrowthStandard.OMS] - Growth standard to use
   * @returns {Promise<Result<GrowthIndicatorValue>>} Calculated indicator value with interpretation
   * @description
   * Internal method that handles the actual calculation of an indicator.
   * Steps include:
   * 1. Finding appropriate growth chart
   * 2. Selecting computation strategy
   * 3. Computing indicator values
   * 4. Determining result interpretation
   */
  private async _calculateIndicator(
    data: AnthropometricVariableObject,
    indicator: Indicator,
    standard: GrowthStandard = GrowthStandard.OMS
  ): Promise<Result<GrowthIndicatorValue>> {
    try {
      // 1. Select appropriate Ref
      const growthRef =
        indicator.getStandardShape() === StandardShape.CURVE
          ? await this.growthReferenceSelectionService.selectChartForIndicator(
              data,
              indicator,
              standard
            )
          : await this.growthReferenceSelectionService.selectTableForIndicator(
              data,
              indicator,
              standard
            );

      if (growthRef.isFailure)
        return Result.fail(formatError(growthRef, GrowthIndicatorService.name));

      // 2. Calculate z-score
      const zScoreResult = await this.zScoreService.calculateZScore<
        typeof growthRef.val
      >(data, indicator, growthRef.val, standard);

      if (zScoreResult.isFailure) {
        return Result.fail(
          formatError(zScoreResult, GrowthIndicatorService.name)
        );
      }
      // 3. Find interpretation
      const interpretationResult =
        await this.interpretationService.findInterpretation(
          data,
          zScoreResult.val.zScore,
          indicator
        );
      if (interpretationResult.isFailure)
        return Result.fail(
          formatError(interpretationResult, GrowthIndicatorService.name)
        );
      // 4. Create Growth Indicator value
      const growthIndicatorValueProps: CreateGrowthIndicatorValueProps = {
        code: indicator.getCode(),
        unit: "zscore",
        reference: {
          standard: standard,
          source: growthRef.val.getCode() as GrowthRefChartAndTableCodes,
          sourceType: indicator.getStandardShape(),
        },
        value: zScoreResult.val.zScore,
        interpretation: interpretationResult.val.unpack().code.unpack(),
        valueRange: interpretationResult.val.unpack().range,
        isValid: true,
        computedValue: zScoreResult.val.computedValue,
      };
      return GrowthIndicatorValue.create(growthIndicatorValueProps);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
