import { DomainDateTime, Result } from "@/core/shared";
import { OnGoingTreatment, MonitoringParameter } from "../models";
import {
  DateUpdateResult,
  ITreatmentDateManagementService,
} from "./interfaces";
import { IDateCalculatorService } from "./helpers";

export class TreatmentDateManagementService
  implements ITreatmentDateManagementService
{
  constructor(private readonly dateCalculatorService: IDateCalculatorService) {}
  /**
   * Génère et définit la date d'action initiale pour un traitement
   */
  generateInitialTreatmentDate(treatment: OnGoingTreatment): Result<boolean> {
    try {
      const data = treatment.getDateCalculationData();

      const result = this.dateCalculatorService.calculateInitialNextDate(
        data.startDate,
        data.frequency,
        data.duration,
        data.endDate
      );

      treatment.setNextActionDate(
        result.shouldContinue ? result.nextDate : null,
        !result.shouldContinue
      );

      return Result.ok(result.shouldContinue);
    } catch (error) {
      return Result.fail(`Failed to generate initial treatment date: ${error}`);
    }
  }

  /**
   * Met à jour la date d'action après exécution d'un traitement
   */
  updateTreatmentDateAfterExecution(
    treatment: OnGoingTreatment,
    executionDate: DomainDateTime
  ): Result<DateUpdateResult> {
    try {
      // Enregistrer l'exécution
      treatment.recordExecution(executionDate);

      const data = treatment.getDateCalculationData();

      const result = this.dateCalculatorService.calculateNextDate(
        data.startDate,
        executionDate,
        data.frequency,
        data.duration,
        data.endDate
      );

      treatment.setNextActionDate(
        result.shouldContinue ? result.nextDate : null,
        !result.shouldContinue
      );

      return Result.ok({
        shouldContinue: result.shouldContinue,
        completed: !result.shouldContinue,
      });
    } catch (error) {
      return Result.fail(
        `Failed to update treatment date after execution: ${error}`
      );
    }
  }

  /**
   * Génère et définit la date de tâche initiale pour un paramètre de monitoring
   */
  generateInitialMonitoringDate(
    parameter: MonitoringParameter
  ): Result<boolean> {
    try {
      const data = parameter.getDateCalculationData();

      const result = this.dateCalculatorService.calculateInitialNextDate(
        data.startDate,
        data.frequency,
        data.duration,
        data.endDate
      );

      parameter.setNextTaskDate(
        result.shouldContinue ? result.nextDate : null,
        !result.shouldContinue
      );

      return Result.ok(result.shouldContinue);
    } catch (error) {
      return Result.fail(
        `Failed to generate initial monitoring date: ${error}`
      );
    }
  }

  /**
   * Met à jour la date de tâche après exécution d'un paramètre de monitoring
   */
  updateMonitoringDateAfterExecution(
    parameter: MonitoringParameter,
    executionDate: DomainDateTime
  ): Result<DateUpdateResult> {
    try {
      // Enregistrer l'exécution
      parameter.recordExecution(executionDate);

      const data = parameter.getDateCalculationData();

      const result = this.dateCalculatorService.calculateNextDate(
        data.startDate,
        executionDate,
        data.frequency,
        data.duration,
        data.endDate
      );

      parameter.setNextTaskDate(
        result.shouldContinue ? result.nextDate : null,
        !result.shouldContinue
      );

      return Result.ok({
        shouldContinue: result.shouldContinue,
        completed: !result.shouldContinue,
      });
    } catch (error) {
      return Result.fail(
        `Failed to update monitoring date after execution: ${error}`
      );
    }
  }

  /**
   * Régénère les dates pour un traitement (utile lors de réactivation)
   */
  regenerateTreatmentDate(treatment: OnGoingTreatment): Result<boolean> {
    return this.generateInitialTreatmentDate(treatment);
  }

  /**
   * Régénère les dates pour un paramètre de monitoring (utile lors de réactivation)
   */
  regenerateMonitoringDate(parameter: MonitoringParameter): Result<boolean> {
    return this.generateInitialMonitoringDate(parameter);
  }

  /**
   * Filtre les traitements dus pour une date donnée
   */
  getTreatmentsDueForDate(
    treatments: OnGoingTreatment[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): OnGoingTreatment[] {
    return treatments.filter(treatment =>
      treatment.isDueForExecution(targetDate)
    );
  }

  /**
   * Filtre les paramètres de monitoring dus pour une date donnée
   */
  getMonitoringParametersDueForDate(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): MonitoringParameter[] {
    return parameters.filter(parameter =>
      parameter.isDueForExecution(targetDate)
    );
  }
}
