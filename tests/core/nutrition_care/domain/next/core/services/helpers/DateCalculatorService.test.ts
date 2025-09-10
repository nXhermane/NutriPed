import { DomainDateTime } from "@/core/shared";
import { DURATION_TYPE, FREQUENCY_TYPE } from "@/core/constants";
import { DateCalculatorService } from "@/core/nutrition_care/domain/next/core/services/helpers/DateCalculatorService";

describe("DateCalculatorService", () => {
  const service = new DateCalculatorService();

  describe("calculateNextDate", () => {
    it("should calculate next date for daily frequency with multiple doses", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;
      const currentDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 1,
        countInUnit: 2, // 2 fois par jour
      };

      const duration = {
        type: DURATION_TYPE.DAYS,
        value: 7,
      };

      const result = service.calculateNextDate(
        startDate,
        currentDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(true);
      // Prochaine exécution dans 12 heures (24h / 2 = 12h)
      const expectedNext = currentDate.addHours(12);
      expect(result.nextDate!.isSameDateTime(expectedNext)).toBe(true);
    });

    it("should calculate next date for every two days", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;
      const currentDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 2,
        countInUnit: 1, // Une fois tous les 2 jours
      };

      const duration = {
        type: DURATION_TYPE.DAYS,
        value: 10,
      };

      const result = service.calculateNextDate(
        startDate,
        currentDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(true);
      // Prochaine exécution dans 48 heures (2 jours)
      const expectedNext = currentDate.addHours(48);
      expect(result.nextDate!.isSameDateTime(expectedNext)).toBe(true);
    });

    it("should handle while_in_phase duration", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;
      const currentDate = DomainDateTime.create("2024-01-05T08:00:00Z").val;

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.WEEKLY,
        intervalValue: 1,
        countInUnit: 1,
      };

      const duration = {
        type: DURATION_TYPE.WHILE_IN_PHASE,
      };

      const result = service.calculateNextDate(
        startDate,
        currentDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(true);
      // Prochaine exécution dans 1 semaine (168 heures)
      const expectedNext = currentDate.addHours(168);
      expect(result.nextDate!.isSameDateTime(expectedNext)).toBe(true);
    });

    it("should stop when duration is exceeded", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;
      const currentDate = DomainDateTime.create("2024-01-08T08:00:00Z").val; // 7 jours plus tard

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 1,
        countInUnit: 1,
      };

      const duration = {
        type: DURATION_TYPE.DAYS,
        value: 7, // 7 jours seulement
      };

      const result = service.calculateNextDate(
        startDate,
        currentDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(false);
    });

    it("should handle hourly frequency correctly", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;
      const currentDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.HOURSLY,
        intervalValue: 6,
        countInUnit: 1, // Toutes les 6 heures
      };

      const duration = {
        type: DURATION_TYPE.HOURS,
        value: 24, // 24 heures
      };

      const result = service.calculateNextDate(
        startDate,
        currentDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(true);
      const expectedNext = currentDate.addHours(6);
      expect(result.nextDate!.isSameDateTime(expectedNext)).toBe(true);
    });

    it("should handle weekly frequency with multiple times per week", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;
      const currentDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.WEEKLY,
        intervalValue: 1,
        countInUnit: 3, // 3 fois par semaine
      };

      const duration = {
        type: DURATION_TYPE.WHILE_IN_PHASE,
      };

      const result = service.calculateNextDate(
        startDate,
        currentDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(true);
      // Prochaine exécution dans 56 heures (168h / 3 = 56h)
      const expectedNext = currentDate.addHours(56);
      expect(result.nextDate!.isSameDateTime(expectedNext)).toBe(true);
    });

    it("should stop while_in_phase when end date is provided", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;
      const currentDate = DomainDateTime.create("2024-01-05T08:00:00Z").val;
      const endDate = DomainDateTime.create("2024-01-04T08:00:00Z").val; // Déjà terminé

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 1,
        countInUnit: 1,
      };

      const duration = {
        type: DURATION_TYPE.WHILE_IN_PHASE,
      };

      const result = service.calculateNextDate(
        startDate,
        currentDate,
        frequency,
        duration,
        endDate
      );

      expect(result.shouldContinue).toBe(false);
    });
  });

  describe("calculateInitialNextDate", () => {
    it("should calculate initial date correctly", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 1,
        countInUnit: 1,
      };

      const duration = {
        type: DURATION_TYPE.DAYS,
        value: 5,
      };

      const result = service.calculateInitialNextDate(
        startDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(true);
      const expectedNext = startDate.addHours(24); // Demain à la même heure
      expect(result.nextDate!.isSameDateTime(expectedNext)).toBe(true);
    });

    it("should handle zero duration correctly", () => {
      const startDate = DomainDateTime.create("2024-01-01T08:00:00Z").val;

      const frequency = {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 1,
        countInUnit: 1,
      };

      const duration = {
        type: DURATION_TYPE.DAYS,
        value: 0, // Durée zéro
      };

      const result = service.calculateInitialNextDate(
        startDate,
        frequency,
        duration
      );

      expect(result.shouldContinue).toBe(false);
    });
  });
});
