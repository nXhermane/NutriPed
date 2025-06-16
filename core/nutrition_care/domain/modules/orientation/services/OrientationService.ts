import {
  ConditionResult,
  evaluateCondition,
  handleError,
  Result,
} from "@shared";
import {
  IOrientationService,
  OrientationContext,
  OrientationResult,
} from "../ports";
import { OrientationReference } from "../models";
import { ORIENTATION_REF_CODES } from "@/core/constants";
export const ORIENTATION_PRIORITY = {
  [ORIENTATION_REF_CODES.ORIENTED_TO_HOME]: 0,
  [ORIENTATION_REF_CODES.ORIENTED_TO_CRENAM]: 1,
  [ORIENTATION_REF_CODES.ORIENTED_TO_CNA]: 2,
  [ORIENTATION_REF_CODES.ORIENTED_TO_CNT]: 3
}
// BETA: Revoir l'implementation de ce service soit pour determiner le type d'admission ou ameliorer la gestion d'erreur pour s'assurer que toutes les variables voulues sont disponibles dans le contexte founir pour l'évaluation
export class OrientationService implements IOrientationService {
  orient(
    orientationContext: OrientationContext,
    orientationRefs: OrientationReference[]
  ): Result<OrientationResult> {
    try {
      const orientationResults: OrientationResult[] = []
      for (const orientationRef of orientationRefs) {
        const orientationCriterias = orientationRef.getAdmissionCriteria();
        const orientationCriteriaEvaluationResults = orientationCriterias.map(
          condition => {
            // BETA:
            // CHANGE:
            const evalutationResult = Result.encapsulate(() =>
              evaluateCondition(condition.value, orientationContext)
            );
            if (evalutationResult.isFailure) return false;
            return evalutationResult.val === ConditionResult.True;
          }
        );
        if (orientationCriteriaEvaluationResults.some(result => result)) {
          orientationResults.push({
            code: orientationRef.getProps().code,
            name: orientationRef.getName(),
          })
        }
      }
      if (orientationResults.length === 0) return Result.fail("The orientation failed. Please check if all needed measure is provided.")
      const orientationResult = this.choseOrientationResult(orientationResults)
      if (orientationResult != null) return Result.ok(orientationResult)
      return Result.fail(
        "The orientation failed. Please check if the orientation context provide all necessary variables."
      );
    } catch (e) {
      return handleError(e);
    }
  }
  private choseOrientationResult(orientationResults: OrientationResult[]): OrientationResult | null {
    let prevPriority = 0
    let hightPriorityOrientationResult = null
    for (const orientationResult of orientationResults) {
      const currentPriority = ORIENTATION_PRIORITY[orientationResult.code.unpack() as keyof typeof ORIENTATION_PRIORITY] || 0
      if (prevPriority <= currentPriority) {
        prevPriority = currentPriority
        hightPriorityOrientationResult = orientationResult
      }
    }
    return hightPriorityOrientationResult
  }


}
