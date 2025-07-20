import { handleError, left, Result, right, UseCase } from "@/core/shared";
import { MakeBiologicalInterpretationRequest } from "./Request";
import { MakeBiologicalInterpretationResponse } from "./Response";
import {
  AnthroSystemCodes,
  BiologicalTestResult,
  DAY_IN_YEARS,
  EvaluationContext,
  IBiologicalInterpretationService,
  IBiologicalValidationService,
} from "./../../../../../domain";
import { BiologicalAnalysisInterpretationDto } from "./../../../../dtos";

export class MakeBiologicalInterpretationUseCase
  implements
    UseCase<
      MakeBiologicalInterpretationRequest,
      MakeBiologicalInterpretationResponse
    >
{
  constructor(
    private readonly biologicalValidationService: IBiologicalValidationService,
    private readonly biologicalInterpretationService: IBiologicalInterpretationService
  ) {}

  async execute(
    request: MakeBiologicalInterpretationRequest
  ): Promise<MakeBiologicalInterpretationResponse> {
    try {
      const context = this.getEvaluationContext(request);
      const biologicalTestResultsRes = this.createBiologicalResults(request);
      if (biologicalTestResultsRes.isFailure)
        return left(biologicalTestResultsRes);
      const biologicalTestResultsValidationRes =
        await this.biologicalValidationService.validate(
          biologicalTestResultsRes.val
        );
      if (biologicalTestResultsValidationRes.isFailure)
        return left(biologicalTestResultsValidationRes);
      const biologicalInterpretationResultRes =
        await this.biologicalInterpretationService.interpret(
          biologicalTestResultsRes.val,
          context
        );
      if (biologicalInterpretationResultRes.isFailure)
        return left(biologicalInterpretationResultRes);
      const dtos: BiologicalAnalysisInterpretationDto[] =
        biologicalInterpretationResultRes.val.map(valueObj => {
          const { code, interpretation, status } = valueObj.unpack();
          return {
            code: code.unpack(),
            interpretation,
            status,
          };
        });
      return right(Result.ok(dtos));
    } catch (e) {
      return left(handleError(e));
    }
  }
  private createBiologicalResults(
    request: MakeBiologicalInterpretationRequest
  ): Result<BiologicalTestResult[]> {
    const biologicaitTestResultRes = request.biologicalTestResults.map(
      testResult => BiologicalTestResult.create(testResult)
    );
    const combinedResut = Result.combine(biologicaitTestResultRes);
    if (combinedResut.isFailure)
      return Result.fail(combinedResut.err as string);
    return Result.ok(biologicaitTestResultRes.map(res => res.val));
  }
  private getEvaluationContext(
    request: MakeBiologicalInterpretationRequest
  ): EvaluationContext {
    return {
      [AnthroSystemCodes.AGE_IN_MONTH]: request[AnthroSystemCodes.AGE_IN_MONTH],
      [AnthroSystemCodes.AGE_IN_DAY]: request[AnthroSystemCodes.AGE_IN_DAY],
      age_in_year: request.age_in_day / DAY_IN_YEARS,
      [AnthroSystemCodes.SEX]: request[AnthroSystemCodes.SEX],
    };
  }
}
