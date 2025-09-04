import { DomainDateTime, Result } from "@/core/shared";
import { OnGoingTreatment, MonitoringParameter } from "../models";

export interface TreatmentUpdateResult {
  shouldContinue: boolean;
  treatmentCompleted: boolean;
}

export interface MonitoringUpdateResult {
  shouldContinue: boolean;
  monitoringEnded: boolean;
}

/**
 * Service pour mettre à jour les prochaines dates d'exécution après une action/tâche
 */
export class NextDateUpdateService {
  /**
   * Met à jour la nextActionDate d'un traitement après exécution d'une action
   * @param treatment Le traitement en cours
   * @param executionDate Date d'exécution de l'action
   * @returns Résultat de la mise à jour
   */
  static updateTreatmentAfterExecution(
    treatment: OnGoingTreatment,
    executionDate: DomainDateTime
  ): TreatmentUpdateResult {
    const shouldContinue = treatment.updateNextActionDateAfterExecution(executionDate);
    
    return {
      shouldContinue,
      treatmentCompleted: !shouldContinue,
    };
  }

  /**
   * Met à jour la nextTaskDate d'un paramètre de monitoring après exécution d'une tâche
   * @param parameter Le paramètre de monitoring
   * @param executionDate Date d'exécution de la tâche
   * @returns Résultat de la mise à jour
   */
  static updateMonitoringParameterAfterExecution(
    parameter: MonitoringParameter,
    executionDate: DomainDateTime
  ): MonitoringUpdateResult {
    const shouldContinue = parameter.updateNextTaskDateAfterExecution(executionDate);
    
    return {
      shouldContinue,
      monitoringEnded: !shouldContinue,
    };
  }

  /**
   * Filtre les traitements qui doivent être exécutés à une date donnée
   * @param treatments Liste des traitements en cours
   * @param targetDate Date cible (par défaut aujourd'hui)
   * @returns Traitements à exécuter
   */
  static getTreatmentsDueForDate(
    treatments: OnGoingTreatment[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): OnGoingTreatment[] {
    return treatments.filter(treatment => {
      const nextActionDate = treatment.getNextActionDate();
      if (!nextActionDate) return false;

      const nextDate = DomainDateTime.create(nextActionDate);
      if (nextDate.isFailure) return false;

      // Vérifier si la date cible est le même jour ou après la prochaine action
      return targetDate.isSameDay(nextDate.val) || targetDate.isAfter(nextDate.val);
    });
  }

  /**
   * Filtre les paramètres de monitoring qui doivent être exécutés à une date donnée
   * @param parameters Liste des paramètres de monitoring
   * @param targetDate Date cible (par défaut aujourd'hui)
   * @returns Paramètres à exécuter
   */
  static getMonitoringParametersDueForDate(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime = DomainDateTime.now()
  ): MonitoringParameter[] {
    return parameters.filter(parameter => {
      const nextTaskDate = parameter.getNextTaskDate();
      if (!nextTaskDate) return false;

      const nextDate = DomainDateTime.create(nextTaskDate);
      if (nextDate.isFailure) return false;

      // Vérifier si la date cible est le même jour ou après la prochaine tâche
      return targetDate.isSameDay(nextDate.val) || targetDate.isAfter(nextDate.val);
    });
  }

  /**
   * Régénère toutes les prochaines dates pour une liste de traitements
   * Utile après des changements de configuration ou de réactivation
   */
  static regenerateAllTreatmentDates(treatments: OnGoingTreatment[]): void {
    treatments.forEach(treatment => {
      if (treatment.getStatus() === 'active') {
        treatment.generateNextActionDate();
      }
    });
  }

  /**
   * Régénère toutes les prochaines dates pour une liste de paramètres de monitoring
   * Utile après des changements de configuration ou de réactivation
   */
  static regenerateAllMonitoringParameterDates(parameters: MonitoringParameter[]): void {
    parameters.forEach(parameter => {
      if (parameter.getEndDate() === null) {
        parameter.generateNextTaskDate();
      }
    });
  }
}