/**
 * @fileoverview Interface defining services for interpreting z-scores and providing
 * clinical significance of anthropometric measurements.
 * @module IZScoreInterpretationService
 */

import { Result } from "@shared";
import { AnthropometricVariableObject } from "../../common";
import { Indicator, IndicatorInterpreter } from "../../models";

/**
 * @interface IZScoreInterpretationService
 * @description Defines the contract for services that handle interpretation of z-scores
 * for anthropometric measurements. Responsible for:
 * - Determining clinical significance of z-scores
 * - Providing standardized interpretations
 * - Considering age and gender-specific thresholds
 */
export interface IZScoreInterpretationService {
   /**
    * Determines the clinical interpretation of a calculated z-score.
    * @param {AnthropometricVariableObject} data - The anthropometric context data
    * @param {number} zScore - The calculated z-score value
    * @param {Indicator} indicator - The indicator being interpreted
    * @returns {Promise<Result<IndicatorInterpreter>>} The clinical interpretation of the z-score
    */
   findInterpretation(data: AnthropometricVariableObject, zScore: number, indicator: Indicator): Promise<Result<IndicatorInterpreter>>;
}
