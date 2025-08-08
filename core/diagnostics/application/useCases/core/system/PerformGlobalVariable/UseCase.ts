import {
  AggregateID,
  formatError,
  handleError,
  left,
  Result,
  right,
  Sex,
  UseCase,
} from "@shared";
import { PerformPatientGlobalVariableRequest } from "./Request";
import { PerformPatientGlobalVariableResponse } from "./Response";
import {
  AnthropometricData,
  BiologicalTestResult,
  ClinicalData,
  ClinicalNutritionalAnalysisResult,
  EvaluationContext,
  GrowthIndicatorValue,
  IAnthropometricVariableGeneratorService,
  IClinicalVariableGeneratorService,
  INutritionalAssessmentService,
  NutritionalDiagnostic,
  NutritionalDiagnosticRepository,
  PatientDiagnosticData,
} from "../../../../../domain";
import {
  AnthroSystemCodes,
  BIOCHEMICAL_REF_CODES,
  CLINICAL_SIGNS,
} from "../../../../../../constants";

export class PerformPatientGlobalVariableUseCase
  implements
    UseCase<
      PerformPatientGlobalVariableRequest,
      PerformPatientGlobalVariableResponse
    >
{
  constructor(
    private readonly diagnosticRepo: NutritionalDiagnosticRepository,
    private readonly nutritionalAssessmentService: INutritionalAssessmentService,
    private readonly anthropometricGenerator: IAnthropometricVariableGeneratorService,
    private readonly clinicalGenerator: IClinicalVariableGeneratorService
  ) {}

  async execute(
    request: PerformPatientGlobalVariableRequest
  ): Promise<PerformPatientGlobalVariableResponse> {
    try {
      // Récupération du diagnostic du patient
      const diagnostic = await this._retrieveDiagnostic(request.patientId);
      const patientData = diagnostic.getPatientData();

      // Préparer le contexte d'évaluation
      const evaluationContext = {
        age_in_day: patientData.age_in_day,
        age_in_month: patientData.age_in_month,
        age_in_year: patientData.age_in_year,
        sex: patientData.sex,
      };

      // S'assurer qu'un résultat diagnostic existe
      const diagnosticResult = await this._ensureDiagnosticResult(
        diagnostic,
        evaluationContext,
        patientData.getAnthropometricData(),
        patientData.getClinicalSigns(),
        patientData.getBiologicalTestResults()
      );

      // Générer les variables anthropométriques
      const anthroResult = await this._generateAnthropometricVariables(
        patientData,
        evaluationContext,
        diagnosticResult.getGrowthIndicatorValues()
      );
      if (anthroResult.isFailure) return left(anthroResult);

      // Générer les variables cliniques
      const clinicalResult = await this._generateClinicalVariables(
        diagnosticResult.getClinicalAnalysis()
      );
      if (clinicalResult.isFailure) return left(clinicalResult);

      // Traitement des variables biologiques
      const biologicalVariables = this._processBiologicalVariables(patientData);

      // Retourner la réponse en cas de succès
      return right(
        Result.ok({
          anthropometricVariableObjects: anthroResult.val as Record<
            AnthroSystemCodes,
            number | Sex | undefined
          >,
          biologicalVariablesObjects: biologicalVariables as Record<
            (typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES],
            number
          >,
          clinicalVariablesObjects: clinicalResult.val as Record<
            (typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS],
            number
          >,
        })
      );
    } catch (error: unknown) {
      return left(handleError(error));
    }
  }

  private async _retrieveDiagnostic(patientId: AggregateID) {
    return await this.diagnosticRepo.getByIdOrPatientId(patientId);
  }

  private async _ensureDiagnosticResult(
    diagnostic: NutritionalDiagnostic,
    evaluationContext: EvaluationContext,
    anthropometricData: AnthropometricData,
    clinicalData: ClinicalData,
    biologicalTestResult: BiologicalTestResult[]
  ) {
    let diagnosticResult = diagnostic.getDiagnosticResult();
    if (!diagnosticResult) {
      const diagResultResponse =
        await this.nutritionalAssessmentService.evaluateNutritionalStatus(
          evaluationContext,
          anthropometricData,
          clinicalData,
          biologicalTestResult
        );
      if (diagResultResponse.isFailure) {
        // Lancer une erreur qui sera gérée par le catch
        throw new Error(
          `L'évaluation du diagnostic a échoué` +
            formatError(diagResultResponse)
        );
      }
      diagnosticResult = diagResultResponse.val;
    }
    return diagnosticResult;
  }

  private async _generateAnthropometricVariables(
    patientData: PatientDiagnosticData,
    evaluationContext: EvaluationContext,
    growthIndicators: GrowthIndicatorValue[]
  ) {
    return await this.anthropometricGenerator.generate(
      patientData.getAnthropometricData(),
      evaluationContext,
      growthIndicators
    );
  }

  private async _generateClinicalVariables(
    clinicalAnalysis: ClinicalNutritionalAnalysisResult[]
  ) {
    return await this.clinicalGenerator.generate(clinicalAnalysis);
  }

  private _processBiologicalVariables(patientData: PatientDiagnosticData) {
    return Object.fromEntries(
      patientData.getBiologicalTestResults().map(testResult => {
        const { code, value } = testResult.unpack();
        return [code.unpack(), value];
      })
    );
  }
}
