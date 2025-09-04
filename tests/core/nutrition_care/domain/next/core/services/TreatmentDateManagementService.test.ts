import { DomainDateTime, Result } from "@/core/shared";
import { DURATION_TYPE, FREQUENCY_TYPE, RECOMMENDED_TREATMENT_TYPE, MEDICINE_CODES, TREATMENT_PLAN_IDS, MONITORING_ELEMENT_CATEGORY, MONITORING_VALUE_SOURCE } from "@/core/constants";
import { OnGoingTreatment, MonitoringParameter } from "@/core/nutrition_care/domain/next/core/models";
import { TreatmentDateManagementService } from "@/core/nutrition_care/domain/next/core/services/TreatmentDateManagementService";
import { IDateCalculatorService, IDateCalculationResult } from "@/core/nutrition_care/domain/next/core/services/helpers/interfaces";
import { GenerateUniqueId } from "@/core/shared/domain/common/GenerateUniqueID";
import { EntityUniqueID } from "@/core/shared/domain/common/EntityUniqueId";

// Mock pour IDateCalculatorService
const mockDateCalculator: jest.Mocked<IDateCalculatorService> = {
  calculateInitialNextDate: jest.fn(),
  calculateNextDate: jest.fn(),
};

// Mock pour GenerateUniqueId
class MockGenerateUniqueId implements GenerateUniqueId {
  private counter = 0;
  generate(): EntityUniqueID {
    this.counter++;
    return new EntityUniqueID(`test-id-${this.counter}`);
  }
}
const mockIdGenerator = new MockGenerateUniqueId();

// Réinitialiser les mocks avant chaque test
beforeEach(() => {
  jest.clearAllMocks();
  // Réinitialiser le compteur du générateur d'ID pour chaque test
  (mockIdGenerator as any).counter = 0;
});

describe("TreatmentDateManagementService", () => {
  const service = new TreatmentDateManagementService(mockDateCalculator);
  const startDate = DomainDateTime.now().toString();

  describe("generateInitialTreatmentDate", () => {
    it("should generate initial date for a valid treatment", () => {
      // Arrange
      const treatmentId = mockIdGenerator.generate().val;
      const recommendationId = mockIdGenerator.generate().val;

      const createRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        startDate: startDate,
        endDate: null,
        nextActionDate: null,
        recommendation: {
          id: recommendationId,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: { type: DURATION_TYPE.DAYS, value: 7 },
          frequency: { intervalUnit: FREQUENCY_TYPE.DAILY, intervalValue: 1, countInUnit: 2 },
        },
      }, treatmentId);

      expect(createRes.isSuccess).toBe(true);
      const treatment = createRes.val;

      const expectedDate = DomainDateTime.now().addDays(1);
      const calculationResult: IDateCalculationResult = {
        shouldContinue: true,
        nextDate: expectedDate,
      };
      mockDateCalculator.calculateInitialNextDate.mockReturnValue(calculationResult);

      // Act
      const result = service.generateInitialTreatmentDate(treatment);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe(true);
      expect(treatment.getNextActionDate()).toEqual(expectedDate.toString());
      expect(treatment.isCompleted()).toBe(false);
    });

    it("should not generate date if calculation result says not to continue", () => {
      // Arrange
      const treatmentId = mockIdGenerator.generate().val;
      const recommendationId = mockIdGenerator.generate().val;

      const createRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        startDate: startDate,
        endDate: null,
        nextActionDate: null,
        recommendation: {
          id: recommendationId,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: { type: DURATION_TYPE.DAYS, value: 0 },
          frequency: { intervalUnit: FREQUENCY_TYPE.DAILY, intervalValue: 1, countInUnit: 1 },
        },
      }, treatmentId);

      expect(createRes.isSuccess).toBe(true);
      const treatment = createRes.val;

      const calculationResult: IDateCalculationResult = {
        shouldContinue: false,
        nextDate: null,
      };
      mockDateCalculator.calculateInitialNextDate.mockReturnValue(calculationResult);

      // Act
      const result = service.generateInitialTreatmentDate(treatment);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe(false);
      expect(treatment.getNextActionDate()).toBeNull();
      expect(treatment.isCompleted()).toBe(true);
    });
  });

  describe("updateTreatmentDateAfterExecution", () => {
    it("should update date after execution and continue", () => {
      // Arrange
      const executionDate = DomainDateTime.create("2024-01-01T20:00:00Z").val;
      const treatmentId = mockIdGenerator.generate().val;
      const recommendationId = mockIdGenerator.generate().val;

      const createRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        startDate: "2024-01-01T08:00:00Z",
        nextActionDate: "2024-01-01T20:00:00Z",
        endDate: null,
        recommendation: {
          id: recommendationId,
          code: MEDICINE_CODES.PARACETAMOL,
          recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
          type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
          duration: { type: DURATION_TYPE.DAYS, value: 7 },
          frequency: { intervalUnit: FREQUENCY_TYPE.DAILY, intervalValue: 1, countInUnit: 2 },
        },
      }, treatmentId);

      expect(createRes.isSuccess).toBe(true);
      const treatment = createRes.val;

      const expectedNextDate = executionDate.addHours(12);
      const calculationResult: IDateCalculationResult = {
        shouldContinue: true,
        nextDate: expectedNextDate,
      };
      mockDateCalculator.calculateNextDate.mockReturnValue(calculationResult);

      // Act
      const result = service.updateTreatmentDateAfterExecution(treatment, executionDate);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.val.shouldContinue).toBe(true);
      expect(result.val.completed).toBe(false);
      expect(treatment.getNextActionDate()).toEqual(expectedNextDate.toString());
    });
  });

  describe("generateInitialMonitoringDate", () => {
    it("should generate initial date for weekly monitoring", () => {
      // Arrange
      const parameterId = mockIdGenerator.generate().val;
      const elementId = mockIdGenerator.generate().val;

      const createRes = MonitoringParameter.create({
        startDate: startDate,
        endDate: null,
        nextTaskDate: null,
        element: {
          id: elementId,
          category: MONITORING_ELEMENT_CATEGORY.ANTHROPOMETRIC,
          source: MONITORING_VALUE_SOURCE.CALCULATED,
          code: "WEIGHT",
          frequency: { intervalUnit: FREQUENCY_TYPE.WEEKLY, intervalValue: 1, countInUnit: 1 },
          duration: { type: DURATION_TYPE.WHILE_IN_PHASE },
        },
      }, parameterId);

      expect(createRes.isSuccess).toBe(true);
      const parameter = createRes.val;

      const expectedDate = DomainDateTime.now().addDays(7);
      const calculationResult: IDateCalculationResult = {
        shouldContinue: true,
        nextDate: expectedDate,
      };
      mockDateCalculator.calculateInitialNextDate.mockReturnValue(calculationResult);

      // Act
      const result = service.generateInitialMonitoringDate(parameter);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe(true);
      expect(parameter.getNextTaskDate()).toEqual(expectedDate.toString());
      expect(parameter.isCompleted()).toBe(false);
    });
  });

  describe("getTreatmentsDueForDate", () => {
    it("should return treatments due for execution", () => {
      // Arrange
      const today = DomainDateTime.now();
      
      const treatmentDueId = mockIdGenerator.generate().val;
      const recommendationDueId = mockIdGenerator.generate().val;
      const treatmentDueRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        startDate: today.toString(),
        endDate: null,
        nextActionDate: today.toString(),
        recommendation: { id: recommendationDueId, code: MEDICINE_CODES.PARACETAMOL, recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1, type: RECOMMENDED_TREATMENT_TYPE.MEDICINE, duration: { type: DURATION_TYPE.DAYS, value: 7 }, frequency: { intervalUnit: FREQUENCY_TYPE.DAILY, intervalValue: 1, countInUnit: 1 } },
      }, treatmentDueId);

      const treatmentNotDueId = mockIdGenerator.generate().val;
      const recommendationNotDueId = mockIdGenerator.generate().val;
      const treatmentNotDueRes = OnGoingTreatment.create({
        code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_2,
        startDate: today.toString(),
        endDate: null,
        nextActionDate: today.addDays(1).toString(),
        recommendation: { id: recommendationNotDueId, code: MEDICINE_CODES.PARACETAMOL, recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_2, type: RECOMMENDED_TREATMENT_TYPE.MEDICINE, duration: { type: DURATION_TYPE.DAYS, value: 7 }, frequency: { intervalUnit: FREQUENCY_TYPE.DAILY, intervalValue: 1, countInUnit: 1 } },
      }, treatmentNotDueId);

      expect(treatmentDueRes.isSuccess).toBe(true);
      expect(treatmentNotDueRes.isSuccess).toBe(true);

      const treatments = [treatmentDueRes.val, treatmentNotDueRes.val];

      // Act
      const dueToday = service.getTreatmentsDueForDate(treatments, today);

      // Assert
      expect(dueToday).toHaveLength(1);
      expect(dueToday[0].getCode()).toBe(TREATMENT_PLAN_IDS.TREATMENT_PLAN_1);
    });
  });
});
