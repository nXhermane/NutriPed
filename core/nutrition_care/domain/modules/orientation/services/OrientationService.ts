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
// BETA: Revoir l'implementation de ce service soit pour determiner le type d'admission ou ameliorer la gestion d'erreur pour s'assurer que toutes les variables voulues sont disponibles dans le contexte founir pour l'évaluation
export class OrientationService implements IOrientationService {
  orient(
    orientationContext: OrientationContext,
    orientationRefs: OrientationReference[]
  ): Result<OrientationResult> {
    try {
      for (const orientationRef of orientationRefs) {
        const orientationCriterias = orientationRef.getAdmissionCriteria();
        const orientationCriteriaEvaluationResults = orientationCriterias.map(
          condition => evaluateCondition(condition.value, orientationContext)
        );
        if (
          orientationCriteriaEvaluationResults.some(
            result => result === ConditionResult.True
          )
        ) {
          return Result.ok({
            code: orientationRef.getProps().code,
            name: orientationRef.getName(),
          });
        }
      }
      return Result.fail(
        "The orientation failed. Please check if the orientation context provide all necessary variables."
      );
    } catch (e) {
      return handleError(e);
    }
  }
}
