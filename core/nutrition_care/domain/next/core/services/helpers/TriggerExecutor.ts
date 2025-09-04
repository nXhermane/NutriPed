import { AggregateID, BaseEntityProps, Result, handleError, GenerateUniqueId } from "@/core/shared";
import { TREATMENT_TRIGGER_ACTION, TREATMENT_PLAN_IDS } from "@/core/constants";
import { IRecommendedTreatment } from "../../../../modules";
import { OnGoingTreatment, OnGoingTreatmentStatus } from "../../models";
import { CarePhase } from "../../models/entities/CarePhase";
import { IRecommendedTreatmentService } from "./RecommendedTreatmentService";
import { ValueOf } from "@/utils";

export interface TriggerExecutionResult {
  executedTriggers: {
    onStart: number;
    onEnd: number;
  };
  errors: string[];
}

export class TriggerExecutor {
  constructor(
    private readonly recommendedTreatmentService: IRecommendedTreatmentService,
    private readonly idGenerator: GenerateUniqueId
  ) {}

  /**
   * Exécute les triggers onStart pour les nouveaux traitements
   */
  async executeOnStartTriggers(
    treatments: OnGoingTreatment[],
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    carePhase: CarePhase
  ): Promise<Result<TriggerExecutionResult>> {
    try {
      const errors: string[] = [];
      let executedCount = 0;

      for (const treatment of treatments) {
        const recommendedTreatment = recommendedTreatments.find(
          rt => rt.id === treatment.getRecommendation().id
        );

        if (recommendedTreatment) {
          const onStartTriggers = recommendedTreatment.triggers.onStart;
          for (const trigger of onStartTriggers) {
            const triggerData = trigger.unpack();
            const executionResult = await this.executeTrigger({
              action: triggerData.action,
              targetTreatment: triggerData.targetTreatment.unpack()
            }, treatment, carePhase);
            if (executionResult.isFailure) {
              errors.push(`Failed to execute onStart trigger for treatment ${treatment.id}: ${executionResult.err}`);
            } else {
              executedCount++;
            }
          }
        }
      }

      return Result.ok({
        executedTriggers: { onStart: executedCount, onEnd: 0 },
        errors,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Exécute les triggers onEnd pour les traitements arrêtés
   */
  async executeOnEndTriggers(
    treatments: OnGoingTreatment[],
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    carePhase: CarePhase
  ): Promise<Result<TriggerExecutionResult>> {
    try {
      const errors: string[] = [];
      let executedCount = 0;

      for (const treatment of treatments) {
        const recommendedTreatment = recommendedTreatments.find(
          rt => rt.id === treatment.getRecommendation().id
        );

        if (recommendedTreatment) {
          const onEndTriggers = recommendedTreatment.triggers.onEnd;
          for (const trigger of onEndTriggers) {
            const triggerData = trigger.unpack();
            const executionResult = await this.executeTrigger({
              action: triggerData.action,
              targetTreatment: triggerData.targetTreatment.unpack()
            }, treatment, carePhase);
            if (executionResult.isFailure) {
              errors.push(`Failed to execute onEnd trigger for treatment ${treatment.id}: ${executionResult.err}`);
            } else {
              executedCount++;
            }
          }
        }
      }

      return Result.ok({
        executedTriggers: { onStart: 0, onEnd: executedCount },
        errors,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Exécute un trigger individuel avec logique récursive
   * La logique des triggers agit sur les OnGoingTreatment existants dans la CarePhase
   * en utilisant le recommendationCode et gère la récursion des triggers en cascade
   */
  private async executeTrigger(
    trigger: { action: TREATMENT_TRIGGER_ACTION; targetTreatment: string },
    treatment: OnGoingTreatment,
    carePhase: CarePhase
  ): Promise<Result<void>> {
    try {
      // Récupérer le RecommendedTreatment par son code de recommandation
      const recommendedTreatmentRes = await this.recommendedTreatmentService.getByRecommendationCode(
        trigger.targetTreatment as ValueOf<typeof TREATMENT_PLAN_IDS>
      );

      if (recommendedTreatmentRes.isFailure) {
        return Result.fail(`Failed to get recommended treatment for code ${trigger.targetTreatment}: ${recommendedTreatmentRes.err}`);
      }

      const recommendedTreatment = recommendedTreatmentRes.val;

      // Chercher le OnGoingTreatment existant dans la CarePhase par recommendationCode
      const existingTreatments = carePhase.getProps().onGoingTreatments;
      const targetTreatment = existingTreatments.find(
        ot => ot.getRecommendation().recommendationCode.unpack() === trigger.targetTreatment
      );

      switch (trigger.action) {
        case TREATMENT_TRIGGER_ACTION.START:
          if (targetTreatment) {
            // Si le traitement existe déjà, l'activer s'il est stoppé
            if (targetTreatment.getStatus() === OnGoingTreatmentStatus.STOPPED) {
              targetTreatment.activeTreatment();
              carePhase.changeOnGoingTreatment(targetTreatment);
              console.log(`Activated existing treatment ${trigger.targetTreatment} via START trigger`);
              
              // Exécuter récursivement les onStart triggers de ce traitement
              await this.executeTreatmentTriggers(targetTreatment, recommendedTreatment, carePhase, 'onStart');
            } else {
              console.log(`Treatment ${trigger.targetTreatment} is already active`);
            }
          } else {
            // Si le traitement n'existe pas, le créer et l'ajouter
            const newTreatmentRes = this.createOnGoingTreatmentFromRecommended(
              recommendedTreatment
            );
            if (newTreatmentRes.isFailure) {
              return Result.fail(`Failed to create new treatment ${trigger.targetTreatment}: ${newTreatmentRes.err}`);
            }
            carePhase.addOnGoingTreatment(newTreatmentRes.val);
            console.log(`Created and added new treatment ${trigger.targetTreatment} via START trigger`);
            
            // Exécuter récursivement les onStart triggers de ce nouveau traitement
            await this.executeTreatmentTriggers(newTreatmentRes.val, recommendedTreatment, carePhase, 'onStart');
          }
          break;

        case TREATMENT_TRIGGER_ACTION.STOP:
          if (targetTreatment) {
            // Arrêter le traitement s'il est actif
            if (targetTreatment.getStatus() === OnGoingTreatmentStatus.ACTIVE) {
              // D'abord exécuter les onEnd triggers avant d'arrêter
              await this.executeTreatmentTriggers(targetTreatment, recommendedTreatment, carePhase, 'onEnd');
              
              targetTreatment.stopTreatment();
              carePhase.changeOnGoingTreatment(targetTreatment);
              console.log(`Stopped treatment ${trigger.targetTreatment} via STOP trigger`);
            } else {
              console.log(`Treatment ${trigger.targetTreatment} is already stopped`);
            }
          } else {
            console.log(`Treatment ${trigger.targetTreatment} not found in CarePhase, nothing to stop`);
          }
          break;

        default:
          return Result.fail(`Unknown trigger action: ${trigger.action}`);
      }

      return Result.ok(void 0);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  /**
   * Exécute les triggers d'un traitement spécifique (onStart ou onEnd)
   * Cette méthode gère la récursion des triggers en cascade
   */
  private async executeTreatmentTriggers(
    treatment: OnGoingTreatment,
    recommendedTreatment: IRecommendedTreatment & { id: AggregateID },
    carePhase: CarePhase,
    triggerType: 'onStart' | 'onEnd'
  ): Promise<void> {
    try {
      const triggers = triggerType === 'onStart' 
        ? recommendedTreatment.triggers.onStart 
        : recommendedTreatment.triggers.onEnd;

      for (const trigger of triggers) {
        const triggerData = trigger.unpack();
        const triggerAction = {
          action: triggerData.action,
          targetTreatment: triggerData.targetTreatment.unpack()
        };

        // Exécuter récursivement ce trigger
        const executionResult = await this.executeTrigger(triggerAction, treatment, carePhase);
        if (executionResult.isFailure) {
          console.warn(`Failed to execute ${triggerType} trigger for treatment ${treatment.id}: ${executionResult.err}`);
        }
      }
    } catch (e: unknown) {
      console.warn(`Error executing ${triggerType} triggers for treatment ${treatment.id}:`, e);
    }
  }

  /**
   * Crée un OnGoingTreatment à partir d'un RecommendedTreatment
   */
  private createOnGoingTreatmentFromRecommended(
    recommendedTreatment: IRecommendedTreatment & { id: AggregateID }
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

  /**
   * Exécute tous les triggers pour une transition complète
   */
  async executeAllTriggers(
    newTreatments: OnGoingTreatment[],
    stoppedTreatments: OnGoingTreatment[],
    recommendedTreatments: (BaseEntityProps & IRecommendedTreatment)[],
    carePhase: CarePhase
  ): Promise<Result<TriggerExecutionResult>> {
    try {
      const onStartResult = await this.executeOnStartTriggers(newTreatments, recommendedTreatments, carePhase);
      const onEndResult = await this.executeOnEndTriggers(stoppedTreatments, recommendedTreatments, carePhase);

      if (onStartResult.isFailure) {
        return onStartResult;
      }
      if (onEndResult.isFailure) {
        return onEndResult;
      }

      return Result.ok({
        executedTriggers: {
          onStart: onStartResult.val.executedTriggers.onStart,
          onEnd: onEndResult.val.executedTriggers.onEnd,
        },
        errors: [
          ...onStartResult.val.errors,
          ...onEndResult.val.errors,
        ],
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
