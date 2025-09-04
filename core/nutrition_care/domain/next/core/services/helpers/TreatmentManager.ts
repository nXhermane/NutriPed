import {
  BaseEntityProps,
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
} from "@/core/shared";
import { IRecommendedTreatment } from "../../../../modules";
import {
  OnGoingTreatment,
  OnGoingTreatmentStatus,
} from "../../models";
import { CarePhase } from "../../models/entities/CarePhase";

export interface TreatmentTransitionResult {
  newTreatments: OnGoingTreatment[];
  reactivatedTreatments: OnGoingTreatment[];
  stoppedTreatments: OnGoingTreatment[];
}

export class TreatmentManager {
  constructor(private readonly idGenerator: GenerateUniqueId) {}

  /**
   * Synchronise les traitements recommandés avec ceux en cours dans la phase de soins
   */
  synchronizeTreatments(
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    currentTreatments: OnGoingTreatment[]
  ): Result<TreatmentTransitionResult> {
    try {
      const mappedCurrentTreatments = new Map(
        currentTreatments.map(treatment => [
          treatment.getRecommendation().id,
          treatment,
        ])
      );

      const newTreatments: OnGoingTreatment[] = [];
      const reactivatedTreatments: OnGoingTreatment[] = [];

      // Traiter les traitements recommandés
      for (const treatment of recommendedTreatments) {
        if (mappedCurrentTreatments.has(treatment.id)) {
          const onGoingTreatment = mappedCurrentTreatments.get(treatment.id)!;
          if (onGoingTreatment.getStatus() === OnGoingTreatmentStatus.STOPPED) {
            onGoingTreatment.activeTreatment();
            reactivatedTreatments.push(onGoingTreatment);
          }
        } else {
          const newTreatmentRes = this.createOnGoingTreatmentFromRecommended(treatment);
          if (newTreatmentRes.isFailure) {
            return Result.fail(
              formatError(newTreatmentRes, TreatmentManager.name)
            );
          }
          newTreatments.push(newTreatmentRes.val);
        }
      }

      // Identifier les traitements à arrêter
      const mappedRecommendedTreatments = new Map(
        recommendedTreatments.map(treatment => [treatment.id, treatment])
      );
      const stoppedTreatments: OnGoingTreatment[] = [];

      for (const treatment of currentTreatments) {
        if (
          !mappedRecommendedTreatments.has(treatment.getRecommendation().id) &&
          treatment.getStatus() === OnGoingTreatmentStatus.ACTIVE
        ) {
          treatment.stopTreatment();
          stoppedTreatments.push(treatment);
        }
      }

      return Result.ok({
        newTreatments,
        reactivatedTreatments,
        stoppedTreatments,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Applique les transitions de traitements à la phase de soins
   */
  applyTreatmentTransitions(
    transitions: TreatmentTransitionResult,
    targetCarePhase: CarePhase
  ): void {
    // Ajouter les nouveaux traitements
    for (const treatment of transitions.newTreatments) {
      targetCarePhase.addOnGoingTreatment(treatment);
    }

    // Mettre à jour les traitements réactivés
    for (const treatment of transitions.reactivatedTreatments) {
      targetCarePhase.changeOnGoingTreatment(treatment);
    }

    // Mettre à jour les traitements arrêtés
    for (const treatment of transitions.stoppedTreatments) {
      targetCarePhase.changeOnGoingTreatment(treatment);
    }
  }

  /**
   * Crée un OnGoingTreatment à partir d'un RecommendedTreatment
   */
  private createOnGoingTreatmentFromRecommended(
    recommendedTreatment: BaseEntityProps & IRecommendedTreatment
  ): Result<OnGoingTreatment> {
    try {
      const onGoingTreatmentRes = OnGoingTreatment.create(
        {
          code: recommendedTreatment.code.unpack(),
          endDate: null,
          nextActionDate: null,
          recommendation: {
            id: recommendedTreatment.id,
            code: recommendedTreatment.treatmentCode.unpack(),
            recommendationCode: recommendedTreatment.code.unpack(),
            type: recommendedTreatment.type,
            duration: recommendedTreatment.duration.unpack(),
            frequency: recommendedTreatment.frequency.unpack(),
            adjustmentPercentage: recommendedTreatment.ajustmentPercentage,
          },
        },
        this.idGenerator.generate().toValue()
      );
      return onGoingTreatmentRes;
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
