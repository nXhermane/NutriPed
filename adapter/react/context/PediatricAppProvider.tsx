import { IEventBus } from "@shared";
import React, { ReactNode, useState } from "react";
import { DiagnosticContext } from "../../evaluation";
import { MedicalRecordAcls, MedicalRecordContext } from "../../medical_record";
import { NutritionCareContext } from "../../nutrition_care";
import { PatientContext } from "../../patient";
import { IndexedDBConnection } from "../../shared";
import { UnitContext } from "../../units";
import {
  PediatricAppContextType,
  PediatricAppContext,
} from "./PediatricAppContext";
import { SQLiteDatabase } from "expo-sqlite";
import { ReminderContext } from "@/adapter/reminders";
import { PatientACLImpl } from "@/core/sharedAcl";
import {
  ClinicalSignDataInterpretationACL,
  MeasurementValidationACLImpl,
  NormalizeAnthropomericDataACL,
} from "@/core/medical_record";

interface PediatricAppProviderProps {
  children: ReactNode;
  dbConnection: IndexedDBConnection | null;
  expo: SQLiteDatabase | null;
  eventBus: IEventBus;
}

export const PediatricAppProvider: React.FC<PediatricAppProviderProps> = ({
  children,
  dbConnection,
  expo,
  eventBus,
}) => {
  const [pediatricApp, setPediatricApp] = useState<PediatricAppContextType>(
    {} as PediatricAppContextType
  );

  // Clean up function to properly dispose contexts when component unmounts
  React.useEffect(() => {
    const initPediatricApp = () => {
      // Initialize all bounded contexts
      // NOTE: ici on utilise la technique d'injection différée donc faite attention
      const diagnosticContext = DiagnosticContext.init(
        dbConnection,
        expo,
        eventBus
      );
      const patientContext = PatientContext.init(dbConnection, expo, eventBus);
      const unitContext = UnitContext.init(dbConnection, expo, eventBus);

      const medicalRecordContext = MedicalRecordContext.init(
        dbConnection,
        expo,
        eventBus
      );

      const medicalRecordAcls: MedicalRecordAcls = {
        patientAcl: new PatientACLImpl(patientContext.getService()),
        clinicalSignDataInterpreterACL: new ClinicalSignDataInterpretationACL(
          diagnosticContext.getMakeClinicalSignDataInterpretationService()
        ),
        measurementACl: new MeasurementValidationACLImpl(
          diagnosticContext.getValidatePatientMeasurementsService()
        ),
        normalizeAnthropometricDataACL: new NormalizeAnthropomericDataACL(
          diagnosticContext.getNormalizeAnthropomtricDataService()
        ),
      };
      medicalRecordContext.setAcls(medicalRecordAcls);
      const nutritionCareContext = NutritionCareContext.init(
        dbConnection,
        expo,
        eventBus
      );

      const reminderContext = ReminderContext.init(
        dbConnection,
        expo,
        eventBus
      );

      const value: PediatricAppContextType = {
        // Get services from Patient BC
        patientService: patientContext.getService(),

        // Get services from Diagnostic BC
        diagnosticServices: {
          anthropometricMeasure:
            diagnosticContext.getAnthropometricMeasureService(),
          indicator: diagnosticContext.getIndicatorService(),
          growthChart: diagnosticContext.getGrowthReferenceChartService(),
          growthTable: diagnosticContext.getGrowthReferenceTableService(),
          growthIndicatorValue:
            diagnosticContext.getGrowthIndicatorValueService(),
          clinicalSign: diagnosticContext.getClinicalSignReferenceService(),
          clinicalNutritionalAnalysis:
            diagnosticContext.getClinicalNutritionalAnalysisService(),
          nutritionalRisk: diagnosticContext.getNutritionalRiskFactorService(),
          biochemicalReference:
            diagnosticContext.getBiochemicalReferenceService(),
          biologicalAnalysis: diagnosticContext.getBiologicalAnalysisService(),
          diagnosticRule: diagnosticContext.getDiagnosticRuleService(),
          nutritionalDiagnostic:
            diagnosticContext.getNutritionalDiagnosticService(),
          validateMeasurements:
            diagnosticContext.getValidatePatientMeasurementsService(),
          dataFields: diagnosticContext.getDataFieldService(),
          nextClinicalAnalysis: diagnosticContext.getNextClinicalAnalysis(),
          nextClinicalRefs: diagnosticContext.getNextClinicalRefService(),
          nextNutritionalRiskFactors:
            diagnosticContext.getNextNutritionalRiskFactorService(),
          appetiteTest: diagnosticContext.getAppetiteTest(),
        },

        // Get service from MedicalRecord BC
        medicalRecordService: medicalRecordContext.getMedicalRecordService(),

        // Get services from NutritionCare BC
        nutritionCareServices: {
          appetiteTest: nutritionCareContext.getAppetiteTestService(),
          complication: nutritionCareContext.getComplicationService(),
          medicine: nutritionCareContext.getMedicineService(),
          milk: nutritionCareContext.getMilkService(),
          orientation: nutritionCareContext.getOrientationService(),
          patientCareSession:
            nutritionCareContext.getPatientCareSessionService(),
        },

        // Get service from Unit BC
        unitService: unitContext.getService(),
        reminderService: reminderContext.getReminderService(),
      };
      setPediatricApp(value);

      return () => {
        diagnosticContext.dispose();
        medicalRecordContext.dispose();
        nutritionCareContext.dispose();
        patientContext.dispose();
        unitContext.dispose();
        reminderContext.dispose();
      };
    };

    const dispose = initPediatricApp();

    return () => dispose();
  }, [expo, dbConnection]);

  return (
    <PediatricAppContext.Provider value={pediatricApp}>
      {children}
    </PediatricAppContext.Provider>
  );
};
