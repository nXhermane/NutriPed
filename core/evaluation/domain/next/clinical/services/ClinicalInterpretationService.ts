import {
  ConditionResult,
  evaluateCondition,
  formatError,
  handleError,
  Result,
} from "@/core/shared";
import { EvaluationContext } from "../../../common";
import { ClinicalNutritionalAnalysisResult } from "../models";
import {
  ClinicalEvaluationResult,
  IClinicalInterpretationService,
  NutritionalRiskFactorRepository,
} from "../ports";

export class ClinicalInterpretationService
  implements IClinicalInterpretationService
{
  constructor(
    private readonly nutritionalRiskRepo: NutritionalRiskFactorRepository
  ) {}
  async interpret(
    clinicalSigns: ClinicalEvaluationResult[],
    context: EvaluationContext
  ): Promise<Result<ClinicalNutritionalAnalysisResult[]>> {
    try {
      const clinicalEvaluationResultInterpretationResult = await Promise.all(
        clinicalSigns.map(sign =>
          this.interpretClinicalEvaluationResut(sign, context)
        )
      );
      const combinedRes = Result.combine(
        clinicalEvaluationResultInterpretationResult
      );
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, ClinicalInterpretationService.name)
        );
      }
      return Result.ok(
        clinicalEvaluationResultInterpretationResult.map(res => res.val)
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async interpretClinicalEvaluationResut(
    clinicalEvaluationResult: ClinicalEvaluationResult,
    context: EvaluationContext
  ): Promise<Result<ClinicalNutritionalAnalysisResult>> {
    try {
      const nutritionalRiskFactors =
        await this.nutritionalRiskRepo.getByClinicalRefCode(
          clinicalEvaluationResult.code
        );
      const adaptedNutritionalRiskFactors = nutritionalRiskFactors.filter(
        riskFactor => {
          const { value: condition, variables } =
            riskFactor.getModulatingCondition();
          const modulationConditionResult = evaluateCondition(
            condition,
            context
          );
          if (typeof modulationConditionResult == "string") {
            throw new Error("Invalide modulation condition evaluation result.");
          }
          return ConditionResult.True == modulationConditionResult
            ? true
            : false;
        }
      );
      return ClinicalNutritionalAnalysisResult.create({
        recommendedTests: adaptedNutritionalRiskFactors.flatMap(riskFactor =>
          riskFactor.getRecommendedTests()
        ),
        suspectedNutrients: adaptedNutritionalRiskFactors.flatMap(riskFactor =>
          riskFactor.getAssociatedNutrients()
        ),
        signCode: clinicalEvaluationResult.code.unpack(),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
