import {
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
} from "@/core/shared";
import {
  CarePlanRecommendation,
  CarePlanAjustement,
  RecommendedTreatmentService,
} from "../../../modules";
import { CarePhase } from "../models";
import { ICarePlanApplicatorService } from "./interfaces";
import {
  TreatmentManager,
  MonitoringParameterManager,
  TriggerExecutor,
} from "./helpers";

/**
 * Service responsable de l'application des plans de soins à une phase de soins.
 * 
 * Le processus d'application suit ces étapes :
 * 1. Synchroniser les traitements recommandés avec ceux en cours
 * 2. Synchroniser les paramètres de monitoring recommandés
 * 3. Exécuter les triggers onStart pour les nouveaux traitements
 * 4. Exécuter les triggers onEnd pour les traitements arrêtés
 * 5. Appliquer toutes les modifications à la phase de soins
 */
export class CarePlanApplicatorService implements ICarePlanApplicatorService {
  private readonly treatmentManager: TreatmentManager;
  private readonly monitoringParameterManager: MonitoringParameterManager;
  private readonly triggerExecutor: TriggerExecutor;

  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly recommendedTreatmentService: RecommendedTreatmentService
  ) {
    this.treatmentManager = new TreatmentManager(idGenerator);
    this.monitoringParameterManager = new MonitoringParameterManager(idGenerator);
    this.triggerExecutor = new TriggerExecutor(recommendedTreatmentService, idGenerator);
  }
  async applyPlan(
    recommendation: CarePlanRecommendation,
    targetCarePhase: CarePhase
  ): Promise<Result<void>> {
    try {
      // 1. Synchroniser les traitements
      const currentTreatments = this.getCarePhaseTreatmentRecommendation(targetCarePhase);
      const treatmentTransitions = this.treatmentManager.synchronizeTreatments(
        recommendation.applicableTreatments,
        currentTreatments
      );

      if (treatmentTransitions.isFailure) {
        return Result.fail(
          formatError(treatmentTransitions, CarePlanApplicatorService.name)
        );
      }

      // 2. Synchroniser les paramètres de monitoring
      const currentMonitoringParameters = this.getCarePhaseMonitoringParameters(targetCarePhase);
      const monitoringTransitions = this.monitoringParameterManager.synchronizeMonitoringParameters(
        recommendation.monitoringElements,
        currentMonitoringParameters
      );

      if (monitoringTransitions.isFailure) {
            return Result.fail(
          formatError(monitoringTransitions, CarePlanApplicatorService.name)
        );
      }

      // 3. Appliquer d'abord les transitions de traitements
      this.treatmentManager.applyTreatmentTransitions(
        treatmentTransitions.val,
        targetCarePhase
      );

      // 4. Exécuter les triggers (la logique de cascade est maintenant dans TriggerExecutor)
      const triggerResult = await this.triggerExecutor.executeAllTriggers(
        treatmentTransitions.val.newTreatments,
        treatmentTransitions.val.stoppedTreatments,
        recommendation.applicableTreatments,
        targetCarePhase
      );

      if (triggerResult.isFailure) {
        return Result.fail(
          formatError(triggerResult, CarePlanApplicatorService.name)
        );
      }

      // 5. Appliquer les transitions de monitoring
      this.monitoringParameterManager.applyMonitoringParameterTransitions(
        monitoringTransitions.val,
        targetCarePhase
      );

      // Log des résultats des triggers pour debugging
      if (triggerResult.val.errors.length > 0) {
        console.warn("Some triggers failed to execute:", triggerResult.val.errors);
      }
      console.log(`Applied care plan: ${triggerResult.val.executedTriggers.onStart} onStart triggers, ${triggerResult.val.executedTriggers.onEnd} onEnd triggers executed`);

      return Result.ok(void 0);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  async applyAjustments(
    ajustement: CarePlanAjustement,
    targetCarePhase: CarePhase
  ): Promise<Result<void>> {
    try {
      // Pour les ajustements, on ne traite que les traitements (pas de monitoring)
      const currentTreatments = this.getCarePhaseTreatmentRecommendation(targetCarePhase);
      const treatmentTransitions = this.treatmentManager.synchronizeTreatments(
        ajustement.treatments,
        currentTreatments
      );

      if (treatmentTransitions.isFailure) {
        return Result.fail(
          formatError(treatmentTransitions, CarePlanApplicatorService.name)
        );
      }

      // Appliquer d'abord les transitions de traitements
      this.treatmentManager.applyTreatmentTransitions(
        treatmentTransitions.val,
        targetCarePhase
      );

      // Exécuter les triggers pour les ajustements (la logique de cascade est maintenant dans TriggerExecutor)
      const triggerResult = await this.triggerExecutor.executeAllTriggers(
        treatmentTransitions.val.newTreatments,
        treatmentTransitions.val.stoppedTreatments,
        ajustement.treatments,
        targetCarePhase
      );

      if (triggerResult.isFailure) {
        return Result.fail(
          formatError(triggerResult, CarePlanApplicatorService.name)
        );
      }

      // Log des résultats
      if (triggerResult.val.errors.length > 0) {
        console.warn("Some adjustment triggers failed to execute:", triggerResult.val.errors);
      }
      console.log(`Applied adjustments: ${triggerResult.val.executedTriggers.onStart} onStart triggers, ${triggerResult.val.executedTriggers.onEnd} onEnd triggers executed`);

      return Result.ok(void 0);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private getCarePhaseTreatmentRecommendation(carePhase: CarePhase) {
    return carePhase.getProps().onGoingTreatments;
  }

  private getCarePhaseMonitoringParameters(carePhase: CarePhase) {
    return carePhase.getProps().monitoringParameters;
  }

}

