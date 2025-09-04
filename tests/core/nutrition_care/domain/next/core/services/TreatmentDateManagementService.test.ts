import { DomainDateTime, AggregateID } from "../../../../../../core/shared";
import { DURATION_TYPE, FREQUENCY_TYPE, RECOMMENDED_TREATMENT_TYPE, MEDICINE_CODES, TREATMENT_PLAN_IDS, MONITORING_ELEMENT_CATEGORY, MONITORING_VALUE_SOURCE } from "../../../../../../core/constants";
import { OnGoingTreatment, MonitoringParameter } from "../../../../../../core/nutrition_care/domain/next/core/models";
import { TreatmentDateManagementService } from "../../../../../../core/nutrition_care/domain/next/core/services/TreatmentDateManagementService";

describe("TreatmentDateManagementService", () => {
  describe("generateInitialTreatmentDate", () => {
    it("should generate initial date for daily treatment", () => {
      const treatmentRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        endDate: null,
        nextActionDate: null,
        recommendation: {
          id: AggregateID.create().val,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: {
            type: DURATION_TYPE.DAYS,
            value: 7,
          },
          frequency: {
            intervalUnit: FREQUENCY_TYPE.DAILY,
            intervalValue: 1,
            countInUnit: 2, // 2 fois par jour
          },
        },
      }, AggregateID.create().val);

      expect(treatmentRes.isSuccess).toBe(true);
      const treatment = treatmentRes.val;

      const result = TreatmentDateManagementService.generateInitialTreatmentDate(treatment);
      
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe(true); // Doit continuer
      expect(treatment.getNextActionDate()).not.toBeNull();
    });

    it("should not generate date for zero duration", () => {
      const treatmentRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        endDate: null,
        nextActionDate: null,
        recommendation: {
          id: AggregateID.create().val,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: {
            type: DURATION_TYPE.DAYS,
            value: 0, // Durée zéro
          },
          frequency: {
            intervalUnit: FREQUENCY_TYPE.DAILY,
            intervalValue: 1,
            countInUnit: 1,
          },
        },
      }, AggregateID.create().val);

      expect(treatmentRes.isSuccess).toBe(true);
      const treatment = treatmentRes.val;

      const result = TreatmentDateManagementService.generateInitialTreatmentDate(treatment);
      
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe(false); // Ne doit pas continuer
      expect(treatment.getNextActionDate()).toBeNull();
    });
  });

  describe("updateTreatmentDateAfterExecution", () => {
    it("should update date after execution and continue", () => {
      const treatmentRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        startDate: "2024-01-01T08:00:00Z",
        endDate: null,
        nextActionDate: "2024-01-01T20:00:00Z", // Première dose à 20h
        recommendation: {
          id: AggregateID.create().val,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: {
            type: DURATION_TYPE.DAYS,
            value: 7,
          },
          frequency: {
            intervalUnit: FREQUENCY_TYPE.DAILY,
            intervalValue: 1,
            countInUnit: 2, // 2 fois par jour
          },
        },
      }, AggregateID.create().val);

      expect(treatmentRes.isSuccess).toBe(true);
      const treatment = treatmentRes.val;

      const executionDate = DomainDateTime.create("2024-01-01T20:00:00Z").val;
      const result = TreatmentDateManagementService.updateTreatmentDateAfterExecution(
        treatment,
        executionDate
      );
      
      expect(result.isSuccess).toBe(true);
      expect(result.val.shouldContinue).toBe(true);
      expect(result.val.completed).toBe(false);
      
      // La prochaine dose devrait être 12 heures plus tard
      const nextActionDate = treatment.getNextActionDate();
      expect(nextActionDate).not.toBeNull();
      
      const expectedNext = executionDate.addHours(12);
      const actualNext = DomainDateTime.create(nextActionDate!).val;
      expect(actualNext.isSameDateTime(expectedNext)).toBe(true);
    });
  });

  describe("generateInitialMonitoringDate", () => {
    it("should generate initial date for weekly monitoring", () => {
      const parameterRes = MonitoringParameter.create({
        endDate: null,
        nextTaskDate: null,
        element: {
          id: AggregateID.create().val,
          category: MONITORING_ELEMENT_CATEGORY.ANTHROPOMETRIC,
          source: MONITORING_VALUE_SOURCE.CALCULATED,
          code: "WEIGHT",
          frequency: {
            intervalUnit: FREQUENCY_TYPE.WEEKLY,
            intervalValue: 1,
            countInUnit: 1, // Une fois par semaine
          },
          duration: {
            type: DURATION_TYPE.WHILE_IN_PHASE,
          },
        },
      }, AggregateID.create().val);

      expect(parameterRes.isSuccess).toBe(true);
      const parameter = parameterRes.val;

      const result = TreatmentDateManagementService.generateInitialMonitoringDate(parameter);
      
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe(true); // Doit continuer
      expect(parameter.getNextTaskDate()).not.toBeNull();
    });
  });

  describe("getTreatmentsDueForDate", () => {
    it("should return treatments due for execution", () => {
      const today = DomainDateTime.now();
      const yesterday = today.addDays(-1);
      
      // Traitement dû aujourd'hui
      const treatmentDueRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        nextActionDate: today.toString(),
        recommendation: {
          id: AggregateID.create().val,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: { type: DURATION_TYPE.DAYS, value: 7 },
          frequency: { intervalUnit: FREQUENCY_TYPE.DAILY, intervalValue: 1, countInUnit: 1 },
        },
      }, AggregateID.create().val);

      // Traitement pas encore dû
      const treatmentNotDueRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_2,
        nextActionDate: today.addDays(1).toString(), // Demain
        recommendation: {
          id: AggregateID.create().val,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_2,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: { type: DURATION_TYPE.DAYS, value: 7 },
          frequency: { intervalUnit: FREQUENCY_TYPE.DAILY, intervalValue: 1, countInUnit: 1 },
        },
      }, AggregateID.create().val);

      expect(treatmentDueRes.isSuccess).toBe(true);
      expect(treatmentNotDueRes.isSuccess).toBe(true);

      const treatments = [treatmentDueRes.val, treatmentNotDueRes.val];
      const dueToday = TreatmentDateManagementService.getTreatmentsDueForDate(treatments, today);

      expect(dueToday).toHaveLength(1);
      expect(dueToday[0].getCode()).toBe(TREATMENT_PLAN_IDS.TREATMENT_PLAN_1);
    });
  });
});