import { DomainDateTime, Result } from "@/core/shared";
import { MonitoringParameter, OnGoingTreatment } from "../../models";

/**
 * Service pour gérer la planification quotidienne des actions et tâches
 */
export interface IDailyScheduleService {
  /**
   * Obtient tous les traitements qui doivent être exécutés aujourd'hui
   * @param treatments Liste des traitements actifs
   * @param targetDate Date cible (par défaut aujourd'hui)
   * @returns Traitements dus pour la date
   */
  getTreatmentsDueForDate(
    treatments: OnGoingTreatment[],
    targetDate: DomainDateTime
  ): OnGoingTreatment[];

  /**
   * Obtient tous les paramètres de monitoring qui doivent être exécutés aujourd'hui
   * @param parameters Liste des paramètres de monitoring actifs
   * @param targetDate Date cible (par défaut aujourd'hui)
   * @returns Paramètres dus pour la date
   */
  getMonitoringParametersDueForDate(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime
  ): MonitoringParameter[];
  /**
   * Marque un traitement comme exécuté et met à jour sa prochaine date
   * @param treatment Le traitement exécuté
   * @param executionDate Date d'exécution (par défaut maintenant)
   * @returns Résultat de la mise à jour
   */
  markTreatmentAsExecuted(
    treatment: OnGoingTreatment,
    executionDate: DomainDateTime
  ): Result<{ shouldContinue: boolean; treatmentCompleted: boolean }>;
  /**
   * Marque un paramètre de monitoring comme exécuté et met à jour sa prochaine date
   * @param parameter Le paramètre exécuté
   * @param executionDate Date d'exécution (par défaut maintenant)
   * @returns Résultat de la mise à jour
   */
  markMonitoringParameterAsExecuted(
    parameter: MonitoringParameter,
    executionDate: DomainDateTime
  ): Result<{ shouldContinue: boolean; monitoringEnded: boolean }>;

  /**
   * Obtient un résumé de la planification quotidienne
   * @param treatments Liste des traitements
   * @param parameters Liste des paramètres de monitoring
   * @param targetDate Date cible
   * @returns Résumé de planification
   */
  getDailyScheduleSummary(
    treatments: OnGoingTreatment[],
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime
  ): {
    treatmentsDue: OnGoingTreatment[];
    monitoringParametersDue: MonitoringParameter[];
    totalActions: number;
    totalTasks: number;
  };
}
