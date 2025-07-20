import { createContext } from "react";
import { DiagnosticContext } from "../../diagnostics";
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
