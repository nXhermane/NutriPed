/**
 * @fileoverview Interface defining services for managing and calculating anthropometric growth indicators
 * using standardized growth references.
 * @module IGrowthIndicatorService
 */

import { Result, SystemCode } from "@shared";
import { AnthropometricVariableObject } from "../../../common";
import {
  Indicator,
  AnthropometricMeasure,
  GrowthIndicatorValue,
} from "../../../models";

/**
 * @interface IGrowthIndicatorService
 * @description Defines the contract for services that handle computation and management of growth indicators
 * for anthropometric measurements. Provides capabilities for:
 * - Identifying applicable growth indicators
 * - Retrieving required measurements
 * - Calculating individual and multiple indicators
 */
export interface IGrowthIndicatorService {
  identifyPossibleIndicator(
    data: AnthropometricVariableObject
  ): Promise<Result<Indicator[]>>;
  getRequireMeasureForIndicator(
    indicatorCode: SystemCode
  ): Promise<Result<AnthropometricMeasure[]>>;
  calculateIndicator(
    data: AnthropometricVariableObject,
    indicatorCode: SystemCode
  ): Promise<Result<GrowthIndicatorValue>>;
  calculateAllIndicators(
    data: AnthropometricVariableObject
  ): Promise<Result<GrowthIndicatorValue[]>>;
}
