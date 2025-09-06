import { CARE_PHASE_CODES } from "@/core/constants";
import {
  CreateCriterion,
  Criterion,
  EntityPropsBaseType,
  Factory,
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import {
  CarePhaseReference,
  CreateFollowUpAction,
  CreateMonitoringElement,
  CreateRecommededTreatment,
  FollowUpAction,
  MonitoringElement,
  RecommendedTreatment,
} from "../models";

export interface CreateCarePhaseReference extends EntityPropsBaseType {
  code: CARE_PHASE_CODES;
  name: string;
  description: string;
  nextPhase: CARE_PHASE_CODES;
  prevPhase: CARE_PHASE_CODES;
  applicabilyConditions: CreateCriterion[];
  failureCriteria: CreateCriterion[];
  transitionCriteria: CreateCriterion[];
  recommendedTreatments: CreateRecommededTreatment[];
  monitoringPlan: CreateMonitoringElement[];
  followUpPlan: CreateFollowUpAction[];
}

export class CarePhaseReferenceFactory
  implements Factory<CreateCarePhaseReference, CarePhaseReference>
{
  constructor(private readonly idGenerator: GenerateUniqueId) {}
  async create(
    props: CreateCarePhaseReference
  ): Promise<Result<CarePhaseReference>> {
    try {
      const codeRes = SystemCode.create(props.code);
      const nextPhaseRes = SystemCode.create(props.nextPhase);
      const prevPhaseRes = SystemCode.create(props.prevPhase);
      const applicationConditionsRes = props.applicabilyConditions.map(
        criteriaProps => Criterion.create(criteriaProps)
      );
      const failureCriteriaRes = props.failureCriteria.map(criteria =>
        Criterion.create(criteria)
      );
      const transitionCriteriaRes = props.transitionCriteria.map(criteria =>
        Criterion.create(criteria)
      );
      const followUpPlanRes = props.followUpPlan.map(action =>
        FollowUpAction.create(action)
      );
      const monitoringPlanRes = props.monitoringPlan.map(element =>
        MonitoringElement.create(element, this.idGenerator.generate().toValue())
      );
      const recommendedTreatmentsRes = props.recommendedTreatments.map(
        treatment =>
          RecommendedTreatment.create(
            treatment,
            this.idGenerator.generate().toValue()
          )
      );
      const combinedRes = Result.combine([
        codeRes,
        nextPhaseRes,
        prevPhaseRes,
        ...applicationConditionsRes,
        ...failureCriteriaRes,
        ...transitionCriteriaRes,
        ...followUpPlanRes,
        ...monitoringPlanRes,
        ...recommendedTreatmentsRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, CarePhaseReferenceFactory.name)
        );
      }
      return Result.ok(
        new CarePhaseReference({
          id: this.idGenerator.generate().toValue(),
          props: {
            code: codeRes.val,
            name: props.name,
            description: props.description,
            nextPhase: nextPhaseRes.val,
            prevPhase: prevPhaseRes.val,
            applicabilyConditions: applicationConditionsRes.map(res => res.val),
            failureCriteria: failureCriteriaRes.map(res => res.val),
            transitionCriteria: transitionCriteriaRes.map(res => res.val),
            monitoringPlan: monitoringPlanRes.map(res => res.val),
            recommendedTreatments: recommendedTreatmentsRes.map(res => res.val),
            followUpPlan: followUpPlanRes.map(res => res.val),
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
