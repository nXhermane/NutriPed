import { ApplicationMapper } from "@/core/shared";
import { CarePhaseDto } from "../dtos";
import { CarePhaseReference } from "../../domain/modules/carePhase";

export class CarePhaseRefMapper implements ApplicationMapper<CarePhaseReference, CarePhaseDto.CarePhaseReferenceDto> {
  toResponse(entity: CarePhaseReference): CarePhaseDto.CarePhaseReferenceDto {
    return {
      id: entity.getID(),
      code: entity.getCode(),
      name: entity.getName(),
      description: entity.getDescription(),
      nextPhaseCode: entity.getNextPhaseCode(),
      prevPhaseCode: entity.getPrevPhaseCode(),
      applicabilyConditions: entity.getApplicabilyCondition().map(criterion => ({
        condition: criterion.condition.unpack(),
        description: criterion.description,
        variablesExplanation: criterion.variablesExplanation,
      })),
      failureCriteria: entity.getFailureCriteria().map(criterion => ({
        condition: criterion.condition.unpack(),
        description: criterion.description,
        variablesExplanation: criterion.variablesExplanation,
      })),
      transitionCriteria: entity.getTransitionCriteria().map(criterion => ({
        condition: criterion.condition.unpack(),
        description: criterion.description,
        variablesExplanation: criterion.variablesExplanation,
      })),
      recommendedTreatments: entity.getRecommendedTreatments().map((treatment) => {
        const { applicabilyCondition } = treatment
        return {
          applicabilyCondition: {
            condition: applicabilyCondition.getCondition(),
            description: applicabilyCondition.getDescription(),
            variablesExplanation: applicabilyCondition.getVariablesExplanation()
          },
          code: treatment.code.unpack(),
          duration: treatment.duration.unpack(),
          frequency: treatment.frequency.unpack(),
          id: treatment.id,
          treatmentCode: treatment.treatmentCode.unpack(),
          triggers: {
            onEnd: treatment.triggers.onEnd.map((onEndTrigger) => ({
              action: onEndTrigger.getAction(),
              targetTreatment: onEndTrigger.getCode()
            })),
            onStart:  treatment.triggers.onStart.map((onStartTrigger) => ({
              action: onStartTrigger.getAction(),
              targetTreatment: onStartTrigger.getCode()
            }))
          },
          type: treatment.type,
        }
      }),
      monitoringElements: entity.getMonitoringElements().map(element => {
        return {
          category: element.category,
          code: element.code.unpack(),
          duration : element.duration.unpack(),
          frequency: element.frequency.unpack(),
          id: element.id,
          source: element.source
        }
      }),
      followUpActions: entity.getFollowUpPlan().map(action => ({
        applicabilities: action.applicabilities.map(criterion => ({
          condition: criterion.getCondition(),
          description: criterion.getDescription(),
          variablesExplanation: criterion.getVariablesExplanation()
        })),
        treatmentToApply: action.treatmentToApply.map(code => code.unpack())
      })),
      createdAt: entity.createdAt, // TODO: Get from entity
      updatedAt: entity.updatedAt
    };
  }
}
