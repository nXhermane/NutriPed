import { IRecommendedTreatment } from "@/core/nutrition_care/domain/modules";
import { BaseEntityProps, Result } from "@/core/shared";
import { OnGoingTreatment, CarePhase } from "../../../models";

export interface TriggerExecutionResult {
  executedTriggers: {
    onStart: number;
    onEnd: number;
  };
  errors: string[];
}
export interface ITriggerExecutor {
  /**
   * Exécute les triggers onStart pour les nouveaux traitements
   */
  executeOnStartTriggers(
    treatments: OnGoingTreatment[],
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    carePhase: CarePhase
  ): Promise<Result<TriggerExecutionResult>>;
  /**
   * Exécute les triggers onEnd pour les traitements arrêtés
   */
  executeOnEndTriggers(
    treatments: OnGoingTreatment[],
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    carePhase: CarePhase
  ): Promise<Result<TriggerExecutionResult>>;
  /**
   * Exécute tous les triggers pour une transition complète
   */
  executeAllTriggers(
    newTreatments: OnGoingTreatment[],
    stoppedTreatments: OnGoingTreatment[],
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    carePhase: CarePhase
  ): Promise<Result<TriggerExecutionResult>>;
}
