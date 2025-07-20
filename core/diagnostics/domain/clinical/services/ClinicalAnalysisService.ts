/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Service responsible for analyzing clinical signs and determining their
 * nutritional implications.
 *
 * @class ClinicalAnalysisService
 * @implements IClinicalAnalysisService
 *
 * Key functionalities:
 * - Analyzes clinical data to identify present signs
 * - Maps clinical signs to potential nutrient deficiencies
 * - Recommends relevant biochemical tests
 * - Evaluates signs against patient context
 */

import {
  ArgumentInvalidException,
  ConditionResult,
  evaluateCondition,
  Result,
} from "@shared";
import { EvaluationContext } from "../../common";
import {
  ClinicalData,
  ClinicalNutritionalAnalysisResult,
  ClinicalSign,
  ClinicalSignReference,
} from "../models";
import {
  ClinicalSignReferenceRepository,
  IClinicalAnalysisService,
  NutritionalRiskFactorRepository,
} from "../ports";
import { CLINICAL_ERRORS, handleClinicalError } from "../errors";
// FIXME: Regler le probleme avec les donnees data du reference avec les varibles . une corrections du cote des donnees de reference pourrai bien ressoudre le probleme lors de l'actualisation de la prochaine version
export class ClinicalAnalysisService implements IClinicalAnalysisService {
  constructor(
    private readonly clinicalSignRepo: ClinicalSignReferenceRepository,
    private readonly nutritionalRiskFactorRepo: NutritionalRiskFactorRepository
  ) {}
  async analyze(
    data: ClinicalData,
    context: EvaluationContext
  ): Promise<Result<ClinicalNutritionalAnalysisResult[]>> {
    try {
      if (!data) {
        return handleClinicalError(
          CLINICAL_ERRORS.VALIDATION.MISSING_DATA.path,
          "Clinical data is required for analysis"
        ) as any;
      }

      const presentSigns = await this.identifyPresentSigns(data, context);
      const analysisResults = await this.analyzeNutritionalRisks(
        presentSigns,
        context
      );

      if (analysisResults.length === 0) {
        return handleClinicalError(
          CLINICAL_ERRORS.ANALYSIS.INTERPRETATION_FAILED.path,
          "No analysis results could be generated"
        ) as any;
      }

      return Result.ok(analysisResults);
    } catch (e: unknown) {
      return handleClinicalError(
        CLINICAL_ERRORS.ANALYSIS.INTERPRETATION_FAILED.path,
        String(e)
      ) as any;
    }
  }
  private extractClinicalSigns(data: ClinicalData): ClinicalSign<any>[] {
    return data.unpack().clinicalSigns;
  }
  // TODO: OPTIMISER
  // FIXME: Je crois que nous ne gerons pas encore la possibilite ou le data n'est pas un require
  private async identifyPresentSigns(
    data: ClinicalData,
    context: EvaluationContext
  ): Promise<ClinicalSign<any>[]> {
    const signs = this.extractClinicalSigns(data);
    const presentClinicalSigns = [];
    for (const clinicalSign of signs) {
      const clinicalSignAssociatedData = clinicalSign.unpack().data;
      const clinicalSignRef: ClinicalSignReference =
        await this.clinicalSignRepo.getByCode(clinicalSign.unpack().code);
      const clinicalSignRefNeedDataCode = clinicalSignRef
        .getRule()
        .variables.filter(x => !Object.keys(context).includes(x));
      if (
        !clinicalSignRefNeedDataCode.every(clinicalRefNeededCode =>
          Object.keys(clinicalSignAssociatedData).includes(
            clinicalRefNeededCode
          )
        )
      ) {
        throw new ArgumentInvalidException(
          CLINICAL_ERRORS.ANALYSIS.SIGN_NOT_FOUND.message
        ); // TODO: Ce n'est pas juste la validation ici
      }

      const ruleEvaluationVariable = {
        ...clinicalSignAssociatedData,
        ...context,
      };

      if (
        !clinicalSignRef
          .getRule()
          .variables.every(variable =>
            Object.keys(ruleEvaluationVariable).includes(variable)
          )
      ) {
        throw new ArgumentInvalidException(
          CLINICAL_ERRORS.ANALYSIS.INVALID_CONDITION.message
        );
      }
      const ruleEvaluationResult = evaluateCondition(
        clinicalSignRef.getRule().value,
        ruleEvaluationVariable
      );
      if (ruleEvaluationResult === ConditionResult.True)
        presentClinicalSigns.push(clinicalSign);
    }
    return presentClinicalSigns;
  }
  // TODO: OPTIMISATION
  private async analyzeNutritionalRisks(
    presentSigns: ClinicalSign<any>[],
    context: EvaluationContext
  ): Promise<ClinicalNutritionalAnalysisResult[]> {
    const clinicalSignAnalyseResult: ClinicalNutritionalAnalysisResult[] = [];
    for (const presentClinicalSign of presentSigns) {
      const nutritionalRiskFactors =
        await this.nutritionalRiskFactorRepo.getByClinicalRefCode(
          presentClinicalSign.unpack().code
        );
      const adaptedNutritionalRiskFactor = nutritionalRiskFactors.filter(
        nutritionalRiskFactor => {
          const { value: condition } =
            nutritionalRiskFactor.getModulatingCondition();
          const modulatingConditionResult = evaluateCondition(
            condition,
            context
          );
          if (modulatingConditionResult === ConditionResult.True) return true;
          return false;
        }
      );
      clinicalSignAnalyseResult.push(
        new ClinicalNutritionalAnalysisResult({
          clinicalSign: presentClinicalSign.unpack().code,
          recommendedTests: [
            ...adaptedNutritionalRiskFactor.flatMap(
              riskFactor => riskFactor.getProps().recommendedTests
            ),
          ],
          suspectedNutrients: [
            ...adaptedNutritionalRiskFactor.flatMap(
              riskFactor => riskFactor.getProps().associatedNutrients
            ),
          ],
        })
      );
    }
    return clinicalSignAnalyseResult;
  }
}
