import { createContext } from "react";
import { DiagnosticContext } from "../../evaluation";
import { MedicalRecordContext } from "../../medical_record";
import { NutritionCareContext } from "../../nutrition_care";
import { PatientContext } from "../../patient";
import { UnitContext } from "../../units";
import { ReminderContext } from "./../../reminders";

export interface PediatricAppContextType {
  // Services from Patient BC
  patientService: ReturnType<typeof PatientContext.prototype.getService>;

  // Services from Diagnostic BC
  diagnosticServices: {
    anthropometricMeasure: ReturnType<
      typeof DiagnosticContext.prototype.getAnthropometricMeasureService
    >;
    indicator: ReturnType<
      typeof DiagnosticContext.prototype.getIndicatorService
    >;
    growthChart: ReturnType<
      typeof DiagnosticContext.prototype.getGrowthReferenceChartService
    >;
    growthTable: ReturnType<
      typeof DiagnosticContext.prototype.getGrowthReferenceTableService
    >;
    growthIndicatorValue: ReturnType<
      typeof DiagnosticContext.prototype.getGrowthIndicatorValueService
    >;
    clinicalSign: ReturnType<
      typeof DiagnosticContext.prototype.getClinicalSignReferenceService
    >;
    clinicalNutritionalAnalysis: ReturnType<
      typeof DiagnosticContext.prototype.getClinicalNutritionalAnalysisService
    >;
    nutritionalRisk: ReturnType<
      typeof DiagnosticContext.prototype.getNutritionalRiskFactorService
    >;
    biochemicalReference: ReturnType<
      typeof DiagnosticContext.prototype.getBiochemicalReferenceService
    >;
    biologicalAnalysis: ReturnType<
      typeof DiagnosticContext.prototype.getBiologicalAnalysisService
    >;
    diagnosticRule: ReturnType<
      typeof DiagnosticContext.prototype.getDiagnosticRuleService
    >;
    nutritionalDiagnostic: ReturnType<
      typeof DiagnosticContext.prototype.getNutritionalDiagnosticService
    >;
    validateMeasurements: ReturnType<
      typeof DiagnosticContext.prototype.getValidatePatientMeasurementsService
    >;
    dataFields: ReturnType<
      typeof DiagnosticContext.prototype.getDataFieldService
    >;
    nextClinicalRefs: ReturnType<
      typeof DiagnosticContext.prototype.getNextClinicalRefService
    >;
    nextClinicalAnalysis: ReturnType<
      typeof DiagnosticContext.prototype.getNextClinicalAnalysis
    >;
    nextNutritionalRiskFactors: ReturnType<
      typeof DiagnosticContext.prototype.getNextNutritionalRiskFactorService
    >;
    appetiteTest: ReturnType<
      typeof DiagnosticContext.prototype.getAppetiteTest
    >;
    patientOrchestrator: ReturnType<
      typeof DiagnosticContext.prototype.getPatientOrchestrator
    >;
    formulaField: ReturnType<
      typeof DiagnosticContext.prototype.getFormulaFieldService
    >;
    makeClinicalSignInterpretation: ReturnType<
      typeof DiagnosticContext.prototype.getMakeClinicalSignDataInterpretationService
    >;
    normalizeData: ReturnType<
      typeof DiagnosticContext.prototype.getNormalizeDataService
    >;
  };

  // Services from MedicalRecord BC
  medicalRecordService: ReturnType<
    typeof MedicalRecordContext.prototype.getMedicalRecordService
  >;

  // Services from NutritionCare BC
  nutritionCareServices: {
    appetiteTest: ReturnType<
      typeof NutritionCareContext.prototype.getAppetiteTestService
    >;
    complication: ReturnType<
      typeof NutritionCareContext.prototype.getComplicationService
    >;
    medicine: ReturnType<
      typeof NutritionCareContext.prototype.getMedicineService
    >;
    milk: ReturnType<typeof NutritionCareContext.prototype.getMilkService>;
    orientation: ReturnType<
      typeof NutritionCareContext.prototype.getOrientationService
    >;
    patientCareSession: ReturnType<
      typeof NutritionCareContext.prototype.getPatientCareSessionService
    >;
    nextMedicine: ReturnType<
      typeof NutritionCareContext.prototype.getNextMedicineService
    >;
    carePhaseReference: ReturnType<
      typeof NutritionCareContext.prototype.getCarePhaseReferenceService
    >;
    nextNutritionalProduct: ReturnType<
      typeof NutritionCareContext.prototype.getNextNutritionalProductAppService
    >;
    nextMilk: ReturnType<
      typeof NutritionCareContext.prototype.getNextMilkAppService
    >;
    nextOrientation: ReturnType<
      typeof NutritionCareContext.prototype.getNextOrientationAppService
    >;
    nextCommunication: ReturnType<
      typeof NutritionCareContext.prototype.getNextCommunicationService
    >;
    nextCompletion: ReturnType<
      typeof NutritionCareContext.prototype.getNextCompletionService
    >;
    nextDailyCareAction: ReturnType<
      typeof NutritionCareContext.prototype.getNextDailyCareActionService
    >;
    nextDailyCareRecord: ReturnType<
      typeof NutritionCareContext.prototype.getNextDailyCareRecordService
    >;
    nextDailyMonitoringTask: ReturnType<
      typeof NutritionCareContext.prototype.getNextDailyMonitoringTaskService
    >;
    nextMonitoringParameter: ReturnType<
      typeof NutritionCareContext.prototype.getNextMonitoringParameterService
    >;
    nextOnGoingTreatment: ReturnType<
      typeof NutritionCareContext.prototype.getNextOnGoingTreatmentService
    >;
    nextOrchestration: ReturnType<
      typeof NutritionCareContext.prototype.getNextOrchestrationService
    >;
    nextPatientCareSession: ReturnType<
      typeof NutritionCareContext.prototype.getNextPatientCareSessionService
    >;
  };

  // Services from Unit BC
  unitService: ReturnType<typeof UnitContext.prototype.getService>;
  // Services from Reminder BC
  reminderService: ReturnType<
    typeof ReminderContext.prototype.getReminderService
  >;
}

export const PediatricAppContext = createContext<
  PediatricAppContextType | undefined
>(undefined);
