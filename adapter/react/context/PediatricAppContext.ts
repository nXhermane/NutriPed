import { createContext } from "react";
import { PatientContext, DiagnosticContext, MedicalRecordContext, NutritionCareContext, UnitContext } from "../../web";

export interface PediatricAppContextType {
   // Services from Patient BC
   patientService: ReturnType<typeof PatientContext.prototype.getService>;

   // Services from Diagnostic BC
   diagnosticServices: {
      anthropometricMeasure: ReturnType<typeof DiagnosticContext.prototype.getAnthropometricMeasureService>;
      indicator: ReturnType<typeof DiagnosticContext.prototype.getIndicatorService>;
      growthChart: ReturnType<typeof DiagnosticContext.prototype.getGrowthReferenceChartService>;
      growthTable: ReturnType<typeof DiagnosticContext.prototype.getGrowthReferenceTableService>;
      clinicalSign: ReturnType<typeof DiagnosticContext.prototype.getClinicalSignReferenceService>;
      nutritionalRisk: ReturnType<typeof DiagnosticContext.prototype.getNutritionalRiskFactorService>;
      biochemicalReference: ReturnType<typeof DiagnosticContext.prototype.getBiochemicalReferenceService>;
      diagnosticRule: ReturnType<typeof DiagnosticContext.prototype.getDiagnosticRuleService>;
      nutritionalDiagnostic: ReturnType<typeof DiagnosticContext.prototype.getNutritionalDiagnosticService>;
      validateMeasurements: ReturnType<typeof DiagnosticContext.prototype.getValidatePatientMeasurementsService>;
   };

   // Services from MedicalRecord BC
   medicalRecordService: ReturnType<typeof MedicalRecordContext.prototype.getMedicalRecordService>;

   // Services from NutritionCare BC
   nutritionCareServices: {
      appetiteTest: ReturnType<typeof NutritionCareContext.prototype.getAppetiteTestService>;
      complication: ReturnType<typeof NutritionCareContext.prototype.getComplicationService>;
      medicine: ReturnType<typeof NutritionCareContext.prototype.getMedicineService>;
      milk: ReturnType<typeof NutritionCareContext.prototype.getMilkService>;
      orientation: ReturnType<typeof NutritionCareContext.prototype.getOrientationService>;
      patientCareSession: ReturnType<typeof NutritionCareContext.prototype.getPatientCareSessionService>;
   };

   // Services from Unit BC
   unitService: ReturnType<typeof UnitContext.prototype.getService>;
}

export const PediatricAppContext = createContext<PediatricAppContextType | undefined>(undefined);
