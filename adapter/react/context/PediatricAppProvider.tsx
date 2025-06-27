import { IEventBus } from "@shared";
import React, { ReactNode, useState } from "react";
import { DiagnosticContext } from "../../diagnostics";
import { MedicalRecordContext } from "../../medical_record";
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
      const diagnosticContext = DiagnosticContext.init(
        dbConnection,
        expo,
        eventBus
      );
      const medicalRecordContext = MedicalRecordContext.init(
        dbConnection,
        expo,
        eventBus
      );
      const nutritionCareContext = NutritionCareContext.init(
        dbConnection,
        expo,
        eventBus
      );
      const patientContext = PatientContext.init(dbConnection, expo, eventBus);
      const unitContext = UnitContext.init(dbConnection, expo, eventBus);
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
          clinicalSign: diagnosticContext.getClinicalSignReferenceService(),
          nutritionalRisk: diagnosticContext.getNutritionalRiskFactorService(),
          biochemicalReference:
            diagnosticContext.getBiochemicalReferenceService(),
          diagnosticRule: diagnosticContext.getDiagnosticRuleService(),
          nutritionalDiagnostic:
            diagnosticContext.getNutritionalDiagnosticService(),
          validateMeasurements:
            diagnosticContext.getValidatePatientMeasurementsService(),
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
