import { BaseEntityProps, Result } from "@/core/shared";
import { CarePhase, OnGoingTreatment } from "../../../models";
import { IRecommendedTreatment } from "@/core/nutrition_care/domain/modules";

export interface TreatmentTransitionResult {
  newTreatments: OnGoingTreatment[];
  reactivatedTreatments: OnGoingTreatment[];
  stoppedTreatments: OnGoingTreatment[];
}
export interface ITreatmentManager {
  /**
   * Synchronise les traitements recommandés avec ceux en cours dans la phase de soins
   */
  synchronizeTreatments(
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    currentTreatments: OnGoingTreatment[]
  ): Result<TreatmentTransitionResult>;
  /**
   * Applique les transitions de traitements à la phase de soins
   */
  applyTreatmentTransitions(
    transitions: TreatmentTransitionResult,
    targetCarePhase: CarePhase
  ): void;
}
