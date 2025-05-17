import React, { ReactNode } from "react";
import { PediatricAppContext, PediatricAppContextType } from "./PediatricAppContext";
import { IEventBus } from "@shared";
import { IndexedDBConnection, DiagnosticContext, MedicalRecordContext, NutritionCareContext, PatientContext, UnitContext } from "../../web";

interface PediatricAppProviderProps {
   children: ReactNode;
   dbConnection: IndexedDBConnection;
   eventBus: IEventBus;
}

export const PediatricAppProvider: React.FC<PediatricAppProviderProps> = ({ children, dbConnection, eventBus }) => {
   // Initialize all bounded contexts
   const diagnosticContext = DiagnosticContext.init(dbConnection, eventBus);
   const medicalRecordContext = MedicalRecordContext.init(dbConnection, eventBus);
   const nutritionCareContext = NutritionCareContext.init(dbConnection, eventBus);
   const patientContext = PatientContext.init(dbConnection, eventBus);
   const unitContext = UnitContext.init(dbConnection, eventBus);

   const value: PediatricAppContextType = {
      // Get services from Patient BC
      patientService: patientContext.getService(),

      // Get services from Diagnostic BC
      diagnosticServices: {
         anthropometricMeasure: diagnosticContext.getAnthropometricMeasureService(),
         indicator: diagnosticContext.getIndicatorService(),
         growthChart: diagnosticContext.getGrowthReferenceChartService(),
         growthTable: diagnosticContext.getGrowthReferenceTableService(),
         clinicalSign: diagnosticContext.getClinicalSignReferenceService(),
         nutritionalRisk: diagnosticContext.getNutritionalRiskFactorService(),
         biochemicalReference: diagnosticContext.getBiochemicalReferenceService(),
         diagnosticRule: diagnosticContext.getDiagnosticRuleService(),
         nutritionalDiagnostic: diagnosticContext.getNutritionalDiagnosticService(),
         validateMeasurements: diagnosticContext.getValidatePatientMeasurementsService(),
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
         patientCareSession: nutritionCareContext.getPatientCareSessionService(),
      },

      // Get service from Unit BC
      unitService: unitContext.getService(),
   };

   // Clean up function to properly dispose contexts when component unmounts
   React.useEffect(() => {
      return () => {
         diagnosticContext.dispose();
         medicalRecordContext.dispose();
         nutritionCareContext.dispose();
         patientContext.dispose();
         unitContext.dispose();
      };
   }, []);

   return <PediatricAppContext.Provider value={value}>{children}</PediatricAppContext.Provider>;
};
