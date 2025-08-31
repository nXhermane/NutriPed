import { CARE_PHASE_CODES } from "@/core/constants";
import {
  SystemCode,
  Result,
  handleError,
  ICriterion,
  catchEvaluationError,
  evaluateCondition,
  getResultFormCatchEvaluationResult,
  ConditionResult,
  formatError,
} from "@/core/shared";
import {
  CarePhaseDecision,
  CarePhaseEvaluationContext,
  CarePhaseEvaluationStatusResult,
  CarePhaseReferenceRepository,
  CarePlanAjustement,
  CarePlanRecommendation,
  ICarePhaseReferenceOrchestrator,
  RecommendedTreatmentRepository,
} from "../ports";

export class CarePhaseReferenceOrchestrator
  implements ICarePhaseReferenceOrchestrator
{
  constructor(
    private readonly repo: CarePhaseReferenceRepository,
    private readonly recommendedTreatmentRepo: RecommendedTreatmentRepository
  ) {}
  async evaluatePhaseStatus(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    context: CarePhaseEvaluationContext
  ): Promise<Result<CarePhaseEvaluationStatusResult>> {
    try {
      const carePhase = await this.getCarePhaseReferenceByCode(carePhaseCode);
      const transitionCriterias = carePhase.getTransitionCriteria();
      const failureCriterias = carePhase.getFailureCriteria();
      const evaluateFailureCriteriasRes = this.evaluateCriterias(
        failureCriterias,
        context
      );
      if (evaluateFailureCriteriasRes.isFailure) {
        return Result.fail(
          formatError(
            evaluateFailureCriteriasRes,
            CarePhaseReferenceOrchestrator.name
          )
        );
      }
      if (evaluateFailureCriteriasRes.val) {
        return Result.ok({
          decision: CarePhaseDecision.FAILURE,
          nextPhaseCode: carePhase.getPrevPhaseCode(),
        });
      }
      const evaluateTransitionCriteriasRes = this.evaluateCriterias(
        transitionCriterias,
        context
      );
      if (evaluateTransitionCriteriasRes.isFailure) {
        return Result.fail(
          formatError(
            evaluateTransitionCriteriasRes,
            CarePhaseReferenceOrchestrator.name
          )
        );
      }
      if (evaluateTransitionCriteriasRes.val) {
        return Result.ok({
          decision: CarePhaseDecision.TRANSITION_TO_NEXT,
          nextPhaseCode: carePhase.getNextPhaseCode(),
        });
      }
      return Result.ok({
        decision: CarePhaseDecision.CONTINUE,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  async determineApplicableCare(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    context: CarePhaseEvaluationContext
  ): Promise<Result<CarePlanRecommendation>> {
    try {
      const carePhase = await this.getCarePhaseReferenceByCode(carePhaseCode);
      const recommendedTreatments = carePhase.getRecommendedTreatments();
      const applicableTreatments = recommendedTreatments.filter(treatment => {
        const criteria = treatment.applicabilyCondition.unpack();
        const criteriaEvaluationResult = this.evaluateCriterias(
          [criteria],
          context
        );
        if (criteriaEvaluationResult.isFailure) {
          throw new Error(String(criteriaEvaluationResult.err));
        }
        return criteriaEvaluationResult.val;
      });
      return Result.ok({
        applicableTreatments: applicableTreatments,
        monitoringElements: carePhase.getMonitoringElements(),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  async ajustOnGoingCarePlan(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    context: CarePhaseEvaluationContext
  ): Promise<Result<CarePlanAjustement>> {
    try {
      const carePhase = await this.getCarePhaseReferenceByCode(carePhaseCode);
      const followUpPlan = carePhase.getFollowUpPlan();
      const filteredFollowUpActions = followUpPlan.filter(plan => {
        const criterias = plan.applicabilities.map(criteria =>
          criteria.unpack()
        );
        const criteriasEvalutionResult = this.evaluateCriterias(
          criterias,
          context
        );
        if (criteriasEvalutionResult.isFailure) {
          throw new Error(String(criteriasEvalutionResult.err));
        }
        return criteriasEvalutionResult.val;
      });
      const recommendedTreatments = await Promise.all(
        filteredFollowUpActions.flatMap(action =>
          action.treatmentToApply.map(code =>
            this.recommendedTreatmentRepo.getByCode(code)
          )
        )
      );
      return Result.ok({
        treatments: recommendedTreatments.map(entity => entity.getProps()),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private getCarePhaseReferenceByCode(code: SystemCode<CARE_PHASE_CODES>) {
    return this.repo.getByCode(code);
  }
  private evaluateCriterias(
    criterias: ICriterion[],
    context: CarePhaseEvaluationContext
  ): Result<boolean> {
    try {
      for (const criteria of criterias) {
        const isApplicableCriteriaRes = Result.encapsulate(() => {
          const condition = criteria.condition.unpack().value;
          const conditionResult = catchEvaluationError(() =>
            evaluateCondition(condition, context)
          );
          return (
            getResultFormCatchEvaluationResult(
              conditionResult,
              criteria.variablesExplanation
            ) === ConditionResult.True
          );
        });
        if (isApplicableCriteriaRes.isFailure) {
          return Result.fail(
            formatError(
              isApplicableCriteriaRes,
              CarePhaseReferenceOrchestrator.name
            )
          );
        }
        if (isApplicableCriteriaRes.val) {
          return Result.ok(true);
        }
      }
      return Result.ok(false);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
