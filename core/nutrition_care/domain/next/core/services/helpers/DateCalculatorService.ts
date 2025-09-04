import { DomainDateTime } from "@/core/shared";
import { DURATION_TYPE, FREQUENCY_TYPE } from "@/core/constants";
import { IDuration, IFrequency } from "../../../modules";

export interface NextDateCalculationResult {
  nextDate: DomainDateTime;
  shouldContinue: boolean;
}

export class DateCalculatorService {
  /**
   * Calcule la prochaine date d'action/tâche basée sur la fréquence et la durée
   * @param startDate Date de début du traitement/monitoring
   * @param currentDate Date actuelle (ou dernière date d'exécution)
   * @param frequency Configuration de fréquence
   * @param duration Configuration de durée
   * @param endDate Date de fin optionnelle (pour les durées while_in_phase)
   * @returns La prochaine date calculée et si on doit continuer la génération
   */
  static calculateNextDate(
    startDate: DomainDateTime,
    currentDate: DomainDateTime,
    frequency: IFrequency,
    duration: IDuration,
    endDate?: DomainDateTime | null
  ): NextDateCalculationResult {
    // Vérifier d'abord si on doit continuer selon la durée
    const shouldContinue = this.shouldContinueBasedOnDuration(
      startDate,
      currentDate,
      duration,
      endDate
    );

    if (!shouldContinue) {
      return {
        nextDate: currentDate,
        shouldContinue: false,
      };
    }

    // Calculer la prochaine date basée sur la fréquence
    const nextDate = this.calculateNextDateBasedOnFrequency(
      currentDate,
      frequency
    );

    // Vérifier à nouveau si la nouvelle date est encore dans la durée valide
    const stillValid = this.shouldContinueBasedOnDuration(
      startDate,
      nextDate,
      duration,
      endDate
    );

    return {
      nextDate,
      shouldContinue: stillValid,
    };
  }

  /**
   * Détermine si on doit continuer la génération basée sur la durée
   */
  private static shouldContinueBasedOnDuration(
    startDate: DomainDateTime,
    currentDate: DomainDateTime,
    duration: IDuration,
    endDate?: DomainDateTime | null
  ): boolean {
    switch (duration.type) {
      case DURATION_TYPE.WHILE_IN_PHASE:
        // Continue tant qu'il n'y a pas de date de fin définie
        return endDate === null || endDate === undefined;

      case DURATION_TYPE.DAYS:
        if (!duration.value) return false;
        const daysDiff = currentDate.diffInDays(startDate);
        return daysDiff < duration.value;

      case DURATION_TYPE.HOURS:
        if (!duration.value) return false;
        const hoursDiff = currentDate.diffInHours(startDate);
        return hoursDiff < duration.value;

      default:
        return false;
    }
  }

  /**
   * Calcule la prochaine date basée sur la fréquence
   */
  private static calculateNextDateBasedOnFrequency(
    currentDate: DomainDateTime,
    frequency: IFrequency
  ): DomainDateTime {
    const { intervalUnit, intervalValue, countInUnit } = frequency;

    // Calculer l'intervalle entre chaque occurrence
    // Si countInUnit = 2 et intervalValue = 1 day, alors intervalle = 12 heures
    // Si countInUnit = 1 et intervalValue = 2 days, alors intervalle = 2 jours
    
    let intervalInHours: number;

    switch (intervalUnit) {
      case FREQUENCY_TYPE.HOURSLY:
        intervalInHours = intervalValue / countInUnit;
        break;
      case FREQUENCY_TYPE.DAILY:
        intervalInHours = (intervalValue * 24) / countInUnit;
        break;
      case FREQUENCY_TYPE.WEEKLY:
        intervalInHours = (intervalValue * 24 * 7) / countInUnit;
        break;
      default:
        throw new Error(`Unsupported frequency unit: ${intervalUnit}`);
    }

    return currentDate.addHours(intervalInHours);
  }

  /**
   * Calcule la première date d'action/tâche pour un nouveau traitement/monitoring
   */
  static calculateInitialNextDate(
    startDate: DomainDateTime,
    frequency: IFrequency,
    duration: IDuration,
    endDate?: DomainDateTime | null
  ): NextDateCalculationResult {
    return this.calculateNextDate(startDate, startDate, frequency, duration, endDate);
  }

  /**
   * Met à jour la prochaine date après l'exécution d'une action/tâche
   */
  static updateNextDateAfterExecution(
    startDate: DomainDateTime,
    lastExecutionDate: DomainDateTime,
    frequency: IFrequency,
    duration: IDuration,
    endDate?: DomainDateTime | null
  ): NextDateCalculationResult {
    return this.calculateNextDate(startDate, lastExecutionDate, frequency, duration, endDate);
  }
}