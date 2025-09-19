import { DomainDateTime, Result } from "@/core/shared";
import { MonitoringParameter, OnGoingTreatment } from "../../models";

export interface TreatmentDueForDate {
  treatment: OnGoingTreatment;
  treatmentActionsDates: DomainDateTime[];
}
export interface MonitoringParameterDueForDate {
  parameter: MonitoringParameter;
  parameterTasksDates: DomainDateTime[];
}
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
  ): Result<TreatmentDueForDate[]>;

  /**
   * Obtient tous les paramètres de monitoring qui doivent être exécutés aujourd'hui
   * @param parameters Liste des paramètres de monitoring actifs
   * @param targetDate Date cible (par défaut aujourd'hui)
   * @returns Paramètres dus pour la date
   */
  getMonitoringParametersDueForDate(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime
  ): Result<MonitoringParameterDueForDate[]>;
}
