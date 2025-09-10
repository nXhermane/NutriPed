import { CarePhaseReference, FollowUpAction } from "@/core/nutrition_care";
import {
  Criterion,
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
  Result,
  SystemCode,
} from "@/core/shared";
import {
  CarePhaseReferencePersistenceDto,
  CarePhaseReferencePersistenceRecordDto,
} from "../dtos/carePhase";

export class CarePhaseReferenceInfraMapper
  implements
    InfrastructureMapper<
      CarePhaseReference,
      CarePhaseReferencePersistenceDto,
      CarePhaseReferencePersistenceRecordDto
    >
{
  toPersistence(entity: CarePhaseReference): CarePhaseReferencePersistenceDto {
    return {
      id: entity.id as string,
      name: entity.getName(),
      code: entity.getCode(),
      description: entity.getDescription(),
      nextPhaseCode: entity.getNextPhaseCode(),
      prevPhaseCode: entity.getPrevPhaseCode(),
      applicabilyConditions: entity
        .getApplicabilyCondition()
        .map(criterion => ({
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
      followUpActions: entity.getFollowUpPlan().map(plan => ({
        applicabilities: plan.applicabilities.map(criterion => ({
          condition: criterion.getCondition(),
          description: criterion.getDescription(),
          variablesExplanation: criterion.getVariablesExplanation(),
        })),
        treatmentToApply: plan.treatmentToApply.map(code => code.unpack()),
      })),
      monitoringElements: entity
        .getMonitoringElements()
        .map(element => element.id),
      recommendedTreatments: entity
        .getRecommendedTreatments()
        .map(treatment => treatment.id),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: CarePhaseReferencePersistenceRecordDto): CarePhaseReference {
    const applicabilyConditionsRes = record.applicabilyConditions.map(
      criterion => Criterion.create(criterion)
    );
    const failureCriteriaRes = record.failureCriteria.map(criterion =>
      Criterion.create(criterion)
    );
    const transistionCriteriaRes = record.transitionCriteria.map(criterion =>
      Criterion.create(criterion)
    );
    const followUpPlanRes = record.followUpActions.map(plan =>
      FollowUpAction.create(plan)
    );
    const codeRes = SystemCode.create(record.code);
    const nextPhaseCodeRes = record.nextPhaseCode
      ? SystemCode.create(record.nextPhaseCode)
      : Result.ok(null);
    const prevPhaseCodeRes = record.prevPhaseCode
      ? SystemCode.create(record.prevPhaseCode)
      : Result.ok(null);
    const combinedRes = Result.combine([
      ...applicabilyConditionsRes,
      ...failureCriteriaRes,
      ...transistionCriteriaRes,
      ...followUpPlanRes,
      codeRes,
      nextPhaseCodeRes,
      prevPhaseCodeRes,
    ]);
    if (combinedRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(combinedRes, CarePhaseReferenceInfraMapper.name)
      );
    }
    return new CarePhaseReference({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        code: codeRes.val,
        description: record.description,
        applicabilyConditions: applicabilyConditionsRes.map(res => res.val),
        failureCriteria: failureCriteriaRes.map(res => res.val),
        transitionCriteria: transistionCriteriaRes.map(res => res.val),
        recommendedTreatments: record.recommendedTreatments,
        followUpPlan: followUpPlanRes.map(res => res.val),
        monitoringPlan: record.monitoringElements,
        name: record.name,
        nextPhase:
          nextPhaseCodeRes.val !== null ? nextPhaseCodeRes.val : undefined,
        prevPhase:
          prevPhaseCodeRes.val !== null ? prevPhaseCodeRes.val : undefined,
      },
    });
  }
}
