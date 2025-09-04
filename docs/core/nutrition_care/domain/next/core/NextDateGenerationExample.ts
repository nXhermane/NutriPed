import { DomainDateTime, AggregateID, GenerateUniqueId } from "@/core/shared";
import { DURATION_TYPE, FREQUENCY_TYPE, RECOMMENDED_TREATMENT_TYPE, MEDICINE_CODES, MONITORING_ELEMENT_CATEGORY, MONITORING_VALUE_SOURCE, TREATMENT_PLAN_IDS } from "@/core/constants";
import { OnGoingTreatment, MonitoringParameter } from "../models";
import { DailyScheduleService, NextDateUpdateService } from "../services";

/**
 * Exemples d'utilisation de la génération automatique des dates
 */
export class NextDateGenerationExample {
  
  /**
   * Exemple 1: Traitement quotidien (2 fois par jour pendant 7 jours)
   */
  static async exampleDailyTreatment(idGenerator: GenerateUniqueId): Promise<void> {
    const treatmentRes = OnGoingTreatment.create({
      code: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
      endDate: null,
      nextActionDate: null,
      recommendation: {
        id: idGenerator.generate().toValue(),
        code: MEDICINE_CODES.PARACETAMOL,
        recommendationCode: TREATMENT_PLAN_IDS.TREATMENT_PLAN_1,
        type: RECOMMENDED_TREATMENT_TYPE.MEDICINE,
        duration: {
          type: DURATION_TYPE.DAYS,
          value: 7, // 7 jours
        },
        frequency: {
          intervalUnit: FREQUENCY_TYPE.DAILY,
          intervalValue: 1, // tous les jours
          countInUnit: 2, // 2 fois par jour
        },
      },
    }, idGenerator.generate().toValue());

    if (treatmentRes.isSuccess) {
      const treatment = treatmentRes.val;
      
      // Génération initiale de la prochaine date
      const hasNextDate = treatment.generateInitialNextActionDate();
      console.log(`Traitement créé avec prochaine action: ${treatment.getNextActionDate()}`);
      console.log(`Doit continuer: ${hasNextDate}`);

      // Simulation d'exécution
      const executionDate = DomainDateTime.now();
      const updateResult = NextDateUpdateService.updateTreatmentAfterExecution(treatment, executionDate);
      console.log(`Après exécution: prochaine action ${treatment.getNextActionDate()}`);
      console.log(`Traitement terminé: ${updateResult.treatmentCompleted}`);
    }
  }

  /**
   * Exemple 2: Monitoring hebdomadaire (1 fois par semaine pendant la phase)
   */
  static async exampleWeeklyMonitoring(idGenerator: GenerateUniqueId): Promise<void> {
    const parameterRes = MonitoringParameter.create({
      endDate: null,
      nextTaskDate: null,
      element: {
        id: idGenerator.generate().toValue(),
        category: MONITORING_ELEMENT_CATEGORY.ANTHROPOMETRIC,
        source: MONITORING_VALUE_SOURCE.CALCULATED,
        code: "WEIGHT",
        frequency: {
          intervalUnit: FREQUENCY_TYPE.WEEKLY,
          intervalValue: 1, // chaque semaine
          countInUnit: 1, // 1 fois par semaine
        },
        duration: {
          type: DURATION_TYPE.WHILE_IN_PHASE, // pendant toute la phase
        },
      },
    }, idGenerator.generate().toValue());

    if (parameterRes.isSuccess) {
      const parameter = parameterRes.val;
      
      // Génération initiale de la prochaine date
      const hasNextDate = parameter.generateInitialNextTaskDate();
      console.log(`Monitoring créé avec prochaine tâche: ${parameter.getNextTaskDate()}`);
      console.log(`Doit continuer: ${hasNextDate}`);

      // Simulation d'exécution
      const executionDate = DomainDateTime.now();
      const updateResult = NextDateUpdateService.updateMonitoringParameterAfterExecution(parameter, executionDate);
      console.log(`Après exécution: prochaine tâche ${parameter.getNextTaskDate()}`);
      console.log(`Monitoring terminé: ${updateResult.monitoringEnded}`);
    }
  }

  /**
   * Exemple 3: Utilisation du service de planification quotidienne
   */
  static async exampleDailyScheduling(
    treatments: OnGoingTreatment[],
    parameters: MonitoringParameter[]
  ): Promise<void> {
    // Obtenir ce qui doit être fait aujourd'hui
    const schedule = DailyScheduleService.getDailyScheduleSummary(treatments, parameters);
    
    console.log(`Actions à effectuer aujourd'hui: ${schedule.totalActions}`);
    console.log(`Tâches de monitoring à effectuer: ${schedule.totalTasks}`);

    // Exécuter les traitements dus
    for (const treatment of schedule.treatmentsDue) {
      const result = DailyScheduleService.markTreatmentAsExecuted(treatment);
      if (result.isSuccess) {
        console.log(`Traitement ${treatment.getCode()} exécuté. Continue: ${!result.val.treatmentCompleted}`);
      }
    }

    // Exécuter les tâches de monitoring dues
    for (const parameter of schedule.monitoringParametersDue) {
      const result = DailyScheduleService.markMonitoringParameterAsExecuted(parameter);
      if (result.isSuccess) {
        console.log(`Monitoring ${parameter.getElement().code} exécuté. Continue: ${!result.val.monitoringEnded}`);
      }
    }
  }

  /**
   * Exemple 4: Différents patterns de fréquence
   */
  static getFrequencyExamples() {
    return {
      // 3 fois par jour
      threeDailyDoses: {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 1,
        countInUnit: 3,
        description: "3 fois par jour (toutes les 8 heures)"
      },
      
      // Tous les 2 jours
      everyTwoDays: {
        intervalUnit: FREQUENCY_TYPE.DAILY,
        intervalValue: 2,
        countInUnit: 1,
        description: "Une fois tous les 2 jours"
      },
      
      // 2 fois par semaine
      twiceWeekly: {
        intervalUnit: FREQUENCY_TYPE.WEEKLY,
        intervalValue: 1,
        countInUnit: 2,
        description: "2 fois par semaine (tous les 3.5 jours)"
      },
      
      // Toutes les 4 heures
      everyFourHours: {
        intervalUnit: FREQUENCY_TYPE.HOURSLY,
        intervalValue: 4,
        countInUnit: 1,
        description: "Toutes les 4 heures"
      }
    };
  }
}