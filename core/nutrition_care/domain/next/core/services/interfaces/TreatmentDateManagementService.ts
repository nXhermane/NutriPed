import { DomainDateTime, Result } from "@/core/shared";
import { MonitoringParameter, OnGoingTreatment } from "../../models";
export interface DateUpdateResult {
  shouldContinue: boolean;
  completed: boolean;
}
/**
 * Service de domaine pour gérer les dates des traitements et paramètres de monitoring
 * Respecte les principes DDD en séparant la logique de calcul des entités
 */
export interface ITreatmentDateManagementService {
  /**
   * Génère et définit la date d'action initiale pour un traitement
   */
  generateInitialTreatmentDate(treatment: OnGoingTreatment): Result<boolean>;
  /**
   * Met à jour la date d'action après exécution d'un traitement
   */
  updateTreatmentDateAfterExecution(
    treatment: OnGoingTreatment,
    executionDate: DomainDateTime
  ): Result<DateUpdateResult>;
  /**
   * Génère et définit la date de tâche initiale pour un paramètre de monitoring
   */
  generateInitialMonitoringDate(
    parameter: MonitoringParameter
  ): Result<boolean>;
  /**
   * Met à jour la date de tâche après exécution d'un paramètre de monitoring
   */
  updateMonitoringDateAfterExecution(
    parameter: MonitoringParameter,
    executionDate: DomainDateTime
  ): Result<DateUpdateResult>;
  /**
   * Régénère les dates pour un traitement (utile lors de réactivation)
   */
  regenerateTreatmentDate(treatment: OnGoingTreatment): Result<boolean>;
  /**
   * Régénère les dates pour un paramètre de monitoring (utile lors de réactivation)
   */
  regenerateMonitoringDate(parameter: MonitoringParameter): Result<boolean>;
  /**
   * Filtre les traitements dus pour une date donnée
   */
  getTreatmentsDueForDate(
    treatments: OnGoingTreatment[],
    targetDate: DomainDateTime
  ): OnGoingTreatment[];
  /**
   * Filtre les paramètres de monitoring dus pour une date donnée
   */
  getMonitoringParametersDueForDate(
    parameters: MonitoringParameter[],
    targetDate: DomainDateTime
  ): MonitoringParameter[];
}
