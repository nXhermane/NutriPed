import { IFrequency, IDuration } from "@/core/nutrition_care/domain/modules";
import { DomainDateTime } from "@/core/shared";

export interface NextDateCalculationResult {
  nextDate: DomainDateTime;
  shouldContinue: boolean;
}

export interface IDateCalculatorService {
  /**
   * Calcule la prochaine date d'action/tâche basée sur la fréquence et la durée
   * @param startDate Date de début du traitement/monitoring
   * @param currentDate Date actuelle (ou dernière date d'exécution)
   * @param frequency Configuration de fréquence
   * @param duration Configuration de durée
   * @param endDate Date de fin optionnelle (pour les durées while_in_phase)
   * @returns La prochaine date calculée et si on doit continuer la génération
   */
  calculateNextDate(
    startDate: DomainDateTime,
    currentDate: DomainDateTime,
    frequency: IFrequency,
    duration: IDuration,
    endDate?: DomainDateTime | null
  ): NextDateCalculationResult;
  /**
   * Calcule la première date d'action/tâche pour un nouveau traitement/monitoring
   */
  calculateInitialNextDate(
    startDate: DomainDateTime,
    frequency: IFrequency,
    duration: IDuration,
    endDate?: DomainDateTime | null
  ): NextDateCalculationResult;
  /**
   * Met à jour la prochaine date après l'exécution d'une action/tâche
   */
  updateNextDateAfterExecution(
    startDate: DomainDateTime,
    lastExecutionDate: DomainDateTime,
    frequency: IFrequency,
    duration: IDuration,
    endDate?: DomainDateTime | null
  ): NextDateCalculationResult;
}
