import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { MakeBiologicalInterpretationRequest } from "../../../biological";
import { MakeIndependantDiagnosticResponse } from "./Response";
import { NutritionalAssessmentResultDto } from "../../../../dtos";
import {
  AnthropometricData,
  BiologicalTestResult,
  ClinicalData,
  CreateAnthropometricData,
  DAY_IN_YEARS,
  EvaluationContext,
  INutritionalAssessmentService,
  NutritionalAssessmentResult,
} from "../../../../../domain";
import { MakeIndependantDiagnosticRequest } from "./Request";

export class MakeIndependantDiagnosticUseCase
  implements
    UseCase<MakeIndependantDiagnosticRequest, MakeIndependantDiagnosticResponse>
{
  constructor(
    private readonly nutritionalAssessmentService: INutritionalAssessmentService,
    private mapper: ApplicationMapper<
      NutritionalAssessmentResult,
      NutritionalAssessmentResultDto
    >
  ) {}

  async execute(
    request: MakeIndependantDiagnosticRequest
  ): Promise<MakeIndependantDiagnosticResponse> {
    try {
      const context = this.getEvaluationContext(request);
      const anthropometricRes = this.createAnthropometricData(request);
      const clinicalRes = this.createClinicalData(request);
      const biologicalRes = this.createBiologicalResults(request);
      const combinedRes = Result.combine([
        anthropometricRes,
        clinicalRes,
        biologicalRes,
      ]);
      if (combinedRes.isFailure) return left(combinedRes);
      const nutritionalAssessmentResult =
        await this.nutritionalAssessmentService.evaluateNutritionalStatus(
          context,
          anthropometricRes.val,
          clinicalRes.val,
          biologicalRes.val
        );
      if (nutritionalAssessmentResult.isFailure)
        return left(nutritionalAssessmentResult);
      return right(
        Result.ok(this.mapper.toResponse(nutritionalAssessmentResult.val))
      );
    } catch (e) {
      return left(handleError(e));
    }
  }

  private createBiologicalResults(
    request: MakeIndependantDiagnosticRequest
  ): Result<BiologicalTestResult[]> {
    const biologicaitTestResultRes = request.biological.map(testResult =>
      BiologicalTestResult.create(testResult)
    );
    const combinedResut = Result.combine(biologicaitTestResultRes);
    if (combinedResut.isFailure)
      return Result.fail(combinedResut.err as string);
    return Result.ok(biologicaitTestResultRes.map(res => res.val));
  }
  private createClinicalData(request: MakeIndependantDiagnosticRequest) {
    return ClinicalData.create({ clinicalSigns: request.clinical });
  }
  private createAnthropometricData(
    request: MakeIndependantDiagnosticRequest
  ): Result<AnthropometricData> {
    return AnthropometricData.create(request.anthropometric);
  }

  private getEvaluationContext(
    request: MakeIndependantDiagnosticRequest
  ): EvaluationContext {
    return {
      age_in_day: request.context.age_in_day,
      age_in_month: request.context.age_in_month,
      age_in_year: request.context.age_in_day / DAY_IN_YEARS,
      sex: request.context.sex,
    };
  }
}
