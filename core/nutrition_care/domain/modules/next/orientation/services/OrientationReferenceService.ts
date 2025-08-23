import {
  catchEvaluationError,
  ConditionResult,
  evaluateCondition,
  Guard,
  handleError,
  Result,
} from "@/core/shared";
import {
  IOrientationService,
  OrientationContext,
  OrientationReferenceRepository,
  OrientationResult,
} from "../ports";
import { OrientationReference } from "../models";

export class OrientationService implements IOrientationService {
  constructor(
    private readonly orientationRepository: OrientationReferenceRepository
  ) {}
  async orient(
    context: OrientationContext
  ): Promise<Result<OrientationResult>> {
    try {
      const orientationReferences = await this.getAllOrientationReference();
      if (Guard.isEmpty(orientationReferences).succeeded) {
        return Result.fail("The orientation reference not found.");
      }
      const orientationResults = this.evaluateOrientations(
        context,
        orientationReferences
      );
      if (orientationResults.length === 0) {
        return Result.fail(
          `The orienation failed. Please check if orientation context provide all  necessary variables.`
        );
      }
      if (orientationResults.length > 1) {
        return Result.fail(
          "The system is comfusing because he got two orientation for the same orientation context. "
        );
      }
      return Result.ok(orientationResults[0]);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private evaluateOrientations(
    context: OrientationContext,
    refs: OrientationReference[]
  ): OrientationResult[] {
    const orientationResults: OrientationResult[] = [];
    for (const ref of refs) {
      if (this.meetsOrientationCriteria(ref, context)) {
        orientationResults.push({
          code: ref.getProps().code,
          treatmentPhase: ref.getProps().treatmentPhase,
        });
      }
    }
    return orientationResults;
  }

  private async getAllOrientationReference(): Promise<OrientationReference[]> {
    return this.orientationRepository.getAll();
  }
  private meetsOrientationCriteria(
    reference: OrientationReference,
    orientationContext: OrientationContext
  ): boolean {
    const criterias = reference.getCriteria();
    return criterias.some(criteria => {
      const evaluationResult = catchEvaluationError(() =>
        evaluateCondition(
          criteria.condition.unpack().value,
          orientationContext as any
        )
      );
      if ("result" in evaluationResult) {
        return evaluationResult.result === ConditionResult.True;
      } else if ("variables" in evaluationResult) {
        throw new Error(
          `The variable missing error. La variable ${evaluationResult.variables?.variableName} (${criteria.variablesExplanation[evaluationResult.variables?.variableName as string]}) n'est pas disponible. [Error]:${evaluationResult.message}.`
        );
      } else {
        throw new Error(evaluationResult.message);
      }
    });
  }
}
