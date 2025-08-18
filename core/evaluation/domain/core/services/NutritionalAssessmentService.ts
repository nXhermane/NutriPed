import {
  ConditionResult,
  evaluateCondition,
  Factory,
  formatError,
  handleError,
  Result,
} from "@shared";
import {
  PatientDiagnosticData,
  NutritionalAssessmentResult,
  GlobalDiagnostic,
  DiagnosticRule,
} from "../models";
import {
  DiagnosticRuleRepository,
  INutritionalAssessmentService,
} from "../ports";
import {
  AnthropometricData,
  AnthropometricVariableObject,
  AnthroSystemCodes,
  GrowthIndicatorValue,
  IAnthropometricVariableGeneratorService,
  IGrowthIndicatorService,
} from "../../anthropometry";
import {
  CLINICAL_SIGNS,
  ClinicalData,
  ClinicalNutritionalAnalysisResult,
  ClinicalVariableObject,
  IClinicalAnalysisService,
  IClinicalVariableGeneratorService,
} from "../../clinical";
import {
  BiologicalAnalysisInterpretation,
  BiologicalTestResult,
  BiologicalVariableObject,
  IBiologicalInterpretationService,
  IBiologicalVariableGeneratorService,
} from "../../biological";
import { EvaluationContext } from "../../common";
import { CORE_SERVICE_ERRORS, handleDiagnosticCoreError } from "../errors";
import { CreateNutritionalAssessmentResultProps } from "../factories";

/**
 * Type representing variables used in global diagnostic evaluation
 */
export type GlobalDiagnosticVariable = AnthropometricVariableObject &
  ClinicalVariableObject &
  BiologicalVariableObject;

/**
 * Service responsible for performing nutritional assessments by evaluating anthropometric,
 * clinical, and biological data to generate comprehensive nutritional diagnostics
 */
export class NutritionalAssessmentService
  implements INutritionalAssessmentService
{
  /**
   * Creates a new instance of NutritionalAssessmentService
   * @param anthropVariableGenerator Service for generating anthropometric variable
   * @param growthIndicatorService Service for growth indicator evaluations
   * @param clinicalService Service for clinical analysis
   * @param clinicalVariableGenerator Service for generating clinical variables
   * @param biologicalService Service for biological interpretations
   * @param diagnosticRuleRepo Repository for diagnostic rules
   * @param nutritionalAssessmentResultFactory Factory for creating nutritional assessment results
   */
  constructor(
    private readonly anthropVariableGenerator: IAnthropometricVariableGeneratorService,
    private readonly growthIndicatorService: IGrowthIndicatorService,
    private readonly clinicalService: IClinicalAnalysisService,
    private readonly clinicalVariableGenerator: IClinicalVariableGeneratorService,
    private readonly biologicalService: IBiologicalInterpretationService,
    private readonly biologicalVariableGenerator: IBiologicalVariableGeneratorService,
    private readonly diagnosticRuleRepo: DiagnosticRuleRepository,
    private readonly nutritionalAssessmentResultFactory: Factory<
      CreateNutritionalAssessmentResultProps,
      NutritionalAssessmentResult
    >
  ) {}

  /**
   * Evaluates the nutritional status of a patient based on various health indicators
   * @param patientData Patient diagnostic data to evaluate
   * @returns Promise containing the result of the nutritional assessment
   */
  async evaluateNutritionalStatus(
    context: EvaluationContext,
    anthropometric: AnthropometricData,
    clinical: ClinicalData,
    biological: BiologicalTestResult[]
  ): Promise<Result<NutritionalAssessmentResult>> {
    try {
      const anthropEvaluation = await this.getAnthropEvaluation(
        anthropometric,
        context
      );
      const clinicalEvaluation = await this.getClinicalEvaluation(
        clinical,
        context
      );

      const biologicalEvaluation = await this.getBiologicalEvaluation(
        biological,
        context
      );
      const evaluationResult = Result.combine([
        anthropEvaluation,
        clinicalEvaluation,
        biologicalEvaluation,
      ]);
      if (evaluationResult.isFailure)
        return Result.fail(
          formatError(evaluationResult, NutritionalAssessmentService.name)
        );

      const globalDiagnostics = await this.globalEvaluation(
        context,
        anthropometric,
        anthropEvaluation.val,
        clinicalEvaluation.val,
        biologicalEvaluation.val
      );
      if (globalDiagnostics.isFailure)
        return Result.fail(
          formatError(globalDiagnostics, NutritionalAssessmentService.name)
        );
      const nutritionAssessmentResult =
        await this.nutritionalAssessmentResultFactory.create({
          globalDiagnostics: globalDiagnostics.val,
          growthIndicatorValues: anthropEvaluation.val,
          clinicalAnalysis: clinicalEvaluation.val,
          biologicalInterpretation: biologicalEvaluation.val,
        });
      return nutritionAssessmentResult;
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Performs anthropometric evaluation based on patient data
   * @param patientData Patient diagnostic data
   * @returns Promise containing growth indicator values
   */
  private async getAnthropEvaluation(
    anthropometricData: AnthropometricData,
    context: EvaluationContext
  ): Promise<Result<GrowthIndicatorValue[]>> {
    try {
      const anthropometricDataResult = await this.generateAnthropVariableObject(
        anthropometricData,
        context
      );
      if (anthropometricDataResult.isFailure)
        return Result.fail(
          formatError(
            anthropometricDataResult,
            NutritionalAssessmentResult.name
          )
        );
      const computingIndicatorRes =
        await this.growthIndicatorService.calculateAllIndicators(
          anthropometricDataResult.val
        );
      return computingIndicatorRes;
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Performs clinical evaluation based on patient data
   * @param patientData Patient diagnostic data
   * @returns Promise containing clinical nutritional analysis results
   */
  private async getClinicalEvaluation(
    clinical: ClinicalData,
    context: EvaluationContext
  ): Promise<Result<ClinicalNutritionalAnalysisResult[]>> {
    try {
      return this.clinicalService.analyze(clinical, context);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Performs biological evaluation based on patient data
   * @param patientData Patient diagnostic data
   * @returns Promise containing biological analysis interpretations
   */
  private async getBiologicalEvaluation(
    biological: BiologicalTestResult[],
    context: EvaluationContext
  ): Promise<Result<BiologicalAnalysisInterpretation[]>> {
    try {
      return this.biologicalService.interpret(biological, context);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Performs global evaluation combining anthropometric and clinical data
   * @param patientData Patient diagnostic data
   * @param growthIndicatorValues Growth indicator values from anthropometric evaluation
   * @param clinicalAnalysis Results from clinical analysis
   * @param biologicalInterpretation Biological results form biological evaluation
   * @returns Promise containing global diagnostics
   */
  private async globalEvaluation(
    context: EvaluationContext,
    anthropometric: AnthropometricData,
    growthIndicatorValues: GrowthIndicatorValue[],
    clinicalAnalysis: ClinicalNutritionalAnalysisResult[],
    biologicalInterpretation: BiologicalAnalysisInterpretation[]
  ): Promise<Result<GlobalDiagnostic[]>> {
    try {
      const anthropometricVariableRes =
        await this.generateAnthropVariableObject(
          anthropometric,
          context,
          growthIndicatorValues
        );
      const clinicalVariable =
        await this.generateClinicalVariableObject(clinicalAnalysis);
      const biologicalVariable = await this.generateBiologicalVariableObject(
        biologicalInterpretation
      );
      const combinedResult = Result.combine([
        anthropometricVariableRes,
        clinicalVariable,
        biologicalVariable,
      ]);
      if (combinedResult.isFailure) {
        return handleDiagnosticCoreError(
          CORE_SERVICE_ERRORS.NUTRITIONAL_ASSESSMENT
            .NEEDED_VARIABLE_GENERATION_FAILED.path,
          `Detail: ${formatError(combinedResult, NutritionalAssessmentService.name)}`
        );
      }
      // BETA:
      this.validateGrowthIndicatorValuesWithClinicalSigns(
        growthIndicatorValues,
        clinicalVariable.val
      );
      // BETA:
      const globalDiagnosticVariable = this.computeGlobalVariable(
        anthropometricVariableRes.val,
        clinicalVariable.val,
        biologicalVariable.val
      );
      const diagnosticRuleRes = await this.getAllDiagnosticRule();
      if (diagnosticRuleRes.isFailure)
        return handleDiagnosticCoreError(
          CORE_SERVICE_ERRORS.NUTRITIONAL_ASSESSMENT.DIAGNOSTIC_RULE_REPO_ERROR
            .path,
          `Detail: ${formatError(diagnosticRuleRes)}`
        );
      const globalDiagnostics = this.interpretDiagnosticRules(
        diagnosticRuleRes.val,
        globalDiagnosticVariable
      );
      if (globalDiagnostics.isFailure)
        return Result.fail(
          formatError(globalDiagnostics, NutritionalAssessmentService.name)
        );
      return Result.ok(globalDiagnostics.val);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Generates anthropometric variable object from patient data and optional growth indicators
   * @param patientData Patient diagnostic data
   * @param growthIndicatorValues Optional growth indicator values
   * @returns Promise containing anthropometric variable object
   */
  private async generateAnthropVariableObject(
    anthropometric: AnthropometricData,
    context: EvaluationContext,
    growthIndicatorValues?: GrowthIndicatorValue[]
  ): Promise<Result<AnthropometricVariableObject>> {
    return this.anthropVariableGenerator.generate(
      anthropometric,
      context,
      growthIndicatorValues
    );
  }

  /**
   * Generates clinical variable object from clinical analysis results
   * @param clinicalAnalysis Clinical analysis results
   * @returns Promise containing clinical variable object
   */
  private async generateClinicalVariableObject(
    clinicalAnalysis: ClinicalNutritionalAnalysisResult[]
  ): Promise<Result<ClinicalVariableObject>> {
    return this.clinicalVariableGenerator.generate(clinicalAnalysis);
  }
  /**
   * Generates biological variable object form biological interpretation result
   * @param biologicalInterpretation Biological test interpretation results
   * @returns Promise containing biological variable object
   */
  private async generateBiologicalVariableObject(
    biologicalInterpretation: BiologicalAnalysisInterpretation[]
  ): Promise<Result<BiologicalVariableObject>> {
    return this.biologicalVariableGenerator.generate(biologicalInterpretation);
  }

  /**
   * Retrieves all diagnostic rules from repository
   * @returns Promise containing array of diagnostic rules
   */
  private async getAllDiagnosticRule(): Promise<Result<DiagnosticRule[]>> {
    try {
      const diagnosticRules = await this.diagnosticRuleRepo.getAll();
      return Result.ok(diagnosticRules);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Interprets diagnostic rules using global variables
   * @param diagnosticRules Array of diagnostic rules to interpret
   * @param globalVariables Global variables for evaluation
   * @returns Result containing array of global diagnostics
   */
  private interpretDiagnosticRules(
    diagnosticRules: DiagnosticRule[],
    globalVariables: GlobalDiagnosticVariable
  ): Result<GlobalDiagnostic[]> {
    try {
      const validateDiagnostic = diagnosticRules.filter(diagnosticRule => {
        return diagnosticRule.getConditions().some(condition => {
          const conditionEvalutationRes = Result.encapsulate(() => {
            const res = this.evaluateCondition(
              condition.value,
              globalVariables
            );
            return res;
          });
          if (conditionEvalutationRes.isFailure) return false;
          return conditionEvalutationRes.val;
        });
      });
      const globalDiagnostics = validateDiagnostic.map(rule =>
        GlobalDiagnostic.create(
          rule.getCode(),
          rule.getConditions().map(condition => condition.value)
        )
      );
      const combinedResult = Result.combine(globalDiagnostics);
      if (combinedResult.isFailure)
        return Result.fail(
          formatError(combinedResult, NutritionalAssessmentService.name)
        );
      return Result.ok(globalDiagnostics.map(diagnostic => diagnostic.val));
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Evaluates a single condition against global variables
   * @param condition Condition string to evaluate
   * @param globalVariables Global variables for evaluation
   * @returns Boolean indicating if condition is met
   */
  private evaluateCondition(
    condition: string,
    globalVariables: GlobalDiagnosticVariable
  ): boolean {
    const conditionEvaluationResult = evaluateCondition(
      condition,
      globalVariables
    );
    return conditionEvaluationResult === ConditionResult.True;
  }

  private computeGlobalVariable(
    anthropometricVariableObject: AnthropometricVariableObject,
    clinicalVariable: ClinicalVariableObject,
    biologicalVariable: BiologicalVariableObject
  ): GlobalDiagnosticVariable {
    // Ici je dois faire un compromis pour la version beta
    // BETA: on doit prendre en charge l'élimination des indicateurs en cas d'œdeme
    const edemaIsPresent =
      clinicalVariable[CLINICAL_SIGNS.EDEMA] === ConditionResult.True;
    const weightBasedIndicator = [
      AnthroSystemCodes.WFH_UNISEX_NCHS,
      AnthroSystemCodes.WFLH_UNISEX,
      AnthroSystemCodes.BMI_FOR_AGE,
      AnthroSystemCodes.WFA,
      AnthroSystemCodes.WFLH,
    ];
    if (edemaIsPresent) {
      for (const indicatorCode of weightBasedIndicator) {
        anthropometricVariableObject[indicatorCode] = undefined as any;
      }
    }
    return {
      ...anthropometricVariableObject,
      ...clinicalVariable,
      ...biologicalVariable,
    } as GlobalDiagnosticVariable;
  }

  // BETA:
  private validateGrowthIndicatorValuesWithClinicalSigns(
    growthIndicatorValues: GrowthIndicatorValue[],
    clinicalVariable: ClinicalVariableObject
  ): GrowthIndicatorValue[] {
    const edemaIsPresent =
      clinicalVariable[CLINICAL_SIGNS.EDEMA] === ConditionResult.True;
    const weightBasedIndicator = [
      AnthroSystemCodes.WFH_UNISEX_NCHS,
      AnthroSystemCodes.WFLH_UNISEX,
      AnthroSystemCodes.BMI_FOR_AGE,
      AnthroSystemCodes.WFA,
      AnthroSystemCodes.WFLH,
    ];
    if (edemaIsPresent) {
      for (const indicatorCode of weightBasedIndicator) {
        const growthIndicatorValueIndex = growthIndicatorValues.findIndex(
          val => val.unpack().code.unpack() === indicatorCode
        );
        if (growthIndicatorValueIndex != -1) {
          const defaultGrowthIndicatorValue =
            growthIndicatorValues[growthIndicatorValueIndex].unpack();
          const growthIndicatorValue = new GrowthIndicatorValue({
            code: defaultGrowthIndicatorValue.code,
            reference: defaultGrowthIndicatorValue.reference,
            interpretation: defaultGrowthIndicatorValue.interpretation,
            unit: defaultGrowthIndicatorValue.unit,
            value: defaultGrowthIndicatorValue.value,
            valueRange: defaultGrowthIndicatorValue.valueRange,
            computedValue: defaultGrowthIndicatorValue.computedValue,
            isValid: false, // This changes
          });
          growthIndicatorValues[growthIndicatorValueIndex] =
            growthIndicatorValue;
        }
      }
    }
    return growthIndicatorValues;
  }
}
