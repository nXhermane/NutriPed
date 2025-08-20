import {
  Birthday,
  formatError,
  Gender,
  handleError,
  left,
  Result,
  right,
  Sex,
  SystemCode,
  UseCase,
} from "@/core/shared";
import { MakeClinicalInterpretationRequest } from "./Request";
import { MakeClinicalInterpretationResponse } from "./Response";
import {
  AnthroSystemCodes,
  DAY_IN_MONTHS,
  EvaluationContext,
  NextClinicalDomain,
} from "@/core/evaluation/domain";

export class MakeClinicalInterpretationUseCase
  implements
    UseCase<
      MakeClinicalInterpretationRequest,
      MakeClinicalInterpretationResponse
    >
{
  constructor(
    private readonly clinicalDataInterpretorService: NextClinicalDomain.IClinicalInterpretationService
  ) {}

  async execute(
    request: MakeClinicalInterpretationRequest
  ): Promise<MakeClinicalInterpretationResponse> {
    try {
      const clinicalEvaluationResultRes = this.createClinicalEvaluations(
        request.data
      );
      const evaluationContextRes = this.generateEvaluationContext(
        request.context
      );
      const combinedRes = Result.combine([
        clinicalEvaluationResultRes,
        evaluationContextRes,
      ]);
      if (combinedRes.isFailure) {
        return left(combinedRes);
      }
      const interpretationResult =
        await this.clinicalDataInterpretorService.interpret(
          clinicalEvaluationResultRes.val,
          evaluationContextRes.val
        );
      if (interpretationResult.isFailure) {
        return left(interpretationResult);
      }
      return right(
        Result.ok(
          interpretationResult.val.map(interpretation => ({
            recommendedTests: interpretation.getRecommendedTests(),
            signCode: interpretation.getSignCode(),
            suspectedNutrients: interpretation.getSuspectedNutrients(),
          }))
        )
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private generateEvaluationContext(
    context: MakeClinicalInterpretationRequest["context"]
  ): Result<EvaluationContext> {
    const birthDayRes = Birthday.create(context.birthday);
    const genderRes = Gender.create(context.sex);
    const combinedRes = Result.combine([birthDayRes, genderRes]);
    if (combinedRes.isFailure) {
      return Result.fail(
        formatError(combinedRes, MakeClinicalInterpretationUseCase.name)
      );
    }
    const ageInDays = birthDayRes.val.getAgeInDays();
    return Result.ok({
      [AnthroSystemCodes.AGE_IN_DAY]: ageInDays,
      [AnthroSystemCodes.AGE_IN_MONTH]: ageInDays / DAY_IN_MONTHS,
      [AnthroSystemCodes.SEX]: genderRes.val.sex as Sex,
    });
  }

  private createClinicalEvaluations(
    data: MakeClinicalInterpretationRequest["data"]
  ): Result<NextClinicalDomain.ClinicalEvaluationResult[]> {
    const clinicalEvaluationResults = [];
    for (const evaluationResult of data) {
      const codeRes = SystemCode.create(evaluationResult.code);
      if (codeRes.isFailure) {
        return Result.fail(
          formatError(codeRes, MakeClinicalInterpretationUseCase.name)
        );
      }
      const isPresent = evaluationResult.isPresent;
      clinicalEvaluationResults.push({
        code: codeRes.val,
        isPresent: evaluationResult.isPresent,
      });
    }
    return Result.ok(clinicalEvaluationResults);
  }
}
