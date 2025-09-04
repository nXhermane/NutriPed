import { DomainDateTime, Result } from "@/core/shared";
import { OnGoingTreatment, MonitoringParameter } from "../models";
import { TreatmentDateManagementService } from "./TreatmentDateManagementService";

/**
 * Service pour gérer la planification quotidienne des actions et tâches
 */
export class DailyScheduleService {
  /**
   * Obtient tous les traitements qui doivent être exécutés aujourd'hui
   * @param treatments Liste des traitements actifs
   * @param targetDate Date cible (par défaut aujourd'hui)
   * @returns Traitements dus pour la date
   */
  static getTreatmentsDueToday(
    treatments: OnGoingTreatment[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): OnGoingTreatment[] {
    return TreatmentDateManagementService.getTreatmentsDueForDate(treatments, targetDate);
  }

  /**
   * Obtient tous les paramètres de monitoring qui doivent être exécutés aujourd'hui
   * @param parameters Liste des paramètres de monitoring actifs
   * @param targetDate Date cible (par défaut aujourd'hui)
   * @returns Paramètres dus pour la date
   */
  static getMonitoringParametersDueToday(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): MonitoringParameter[] {
    return TreatmentDateManagementService.getMonitoringParametersDueForDate(parameters, targetDate);
  }

  /**
   * Marque un traitement comme exécuté et met à jour sa prochaine date
   * @param treatment Le traitement exécuté
   * @param executionDate Date d'exécution (par défaut maintenant)
   * @returns Résultat de la mise à jour
   */
  static markTreatmentAsExecuted(
    treatment: OnGoingTreatment,
    executionDate: DomainDateTime = DomainDateTime.now()
  ): Result<{ shouldContinue: boolean; treatmentCompleted: boolean }> {
    try {
      const updateResult = TreatmentDateManagementService.updateTreatmentDateAfterExecution(
        treatment,
        executionDate
      );
      if (updateResult.isSuccess) {
        return Result.ok({
          shouldContinue: updateResult.val.shouldContinue,
          treatmentCompleted: updateResult.val.completed,
        });
      }
      return Result.fail(updateResult.error);
    } catch (error) {
      return Result.fail(`Failed to update treatment after execution: ${error}`);
    }
  }

  /**
   * Marque un paramètre de monitoring comme exécuté et met à jour sa prochaine date
   * @param parameter Le paramètre exécuté
   * @param executionDate Date d'exécution (par défaut maintenant)
   * @returns Résultat de la mise à jour
   */
  static markMonitoringParameterAsExecuted(
    parameter: MonitoringParameter,
    executionDate: DomainDateTime = DomainDateTime.now()
  ): Result<{ shouldContinue: boolean; monitoringEnded: boolean }> {
    try {
      const updateResult = TreatmentDateManagementService.updateMonitoringDateAfterExecution(
        parameter,
        executionDate
      );
      if (updateResult.isSuccess) {
        return Result.ok({
          shouldContinue: updateResult.val.shouldContinue,
          monitoringEnded: updateResult.val.completed,
        });
      }
      return Result.fail(updateResult.error);
    } catch (error) {
      return Result.fail(`Failed to update monitoring parameter after execution: ${error}`);
    }
  }

  /**
   * Obtient un résumé de la planification quotidienne
   * @param treatments Liste des traitements
   * @param parameters Liste des paramètres de monitoring
   * @param targetDate Date cible
   * @returns Résumé de planification
   */
  static getDailyScheduleSummary(
    treatments: OnGoingTreatment[],
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): {
    treatmentsDue: OnGoingTreatment[];
    monitoringParametersDue: MonitoringParameter[];
    totalActions: number;
    totalTasks: number;
  } {
    const treatmentsDue = this.getTreatmentsDueToday(treatments, targetDate);
    const monitoringParametersDue = this.getMonitoringParametersDueToday(parameters, targetDate);

    return {
      treatmentsDue,
      monitoringParametersDue,
      totalActions: treatmentsDue.length,
      totalTasks: monitoringParametersDue.length,
    };
  }
}