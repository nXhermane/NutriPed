import {
  ApplicationMapper,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GenerateDiagnosticResultRequest } from "./Request";
import { GenerateDiagnosticResultResponse } from "./Response";
import {
  INutritionalAssessmentService,
  NutritionalAssessmentResult,
  NutritionalDiagnosticRepository,
} from "../../../../../domain";
import { NutritionalAssessmentResultDto } from "../../../../dtos";

export class GenerateDiagnosticResultUseCase
  implements
    UseCase<GenerateDiagnosticResultRequest, GenerateDiagnosticResultResponse>
{
  constructor(
    private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
    private readonly nutritionalAssessmentService: INutritionalAssessmentService,
    private mapper: ApplicationMapper<
      NutritionalAssessmentResult,
      NutritionalAssessmentResultDto
    >
  ) {}
  async execute(
    request: GenerateDiagnosticResultRequest
  ): Promise<GenerateDiagnosticResultResponse> {
    try {
      const nutritionalDiagnostic =
        await this.nutritionalDiagnosticRepo.getByIdOrPatientId(
          request.nutritionalDiagnosticId
        );
      const nutritionalAssessmentResult =
        await this.nutritionalAssessmentService.evaluateNutritionalStatus(
          nutritionalDiagnostic.getPatientData()
        );
      if (nutritionalAssessmentResult.isFailure)
        return left(nutritionalAssessmentResult);
      nutritionalDiagnostic.saveDiagnostic(nutritionalAssessmentResult.val);
      await this.nutritionalDiagnosticRepo.save(nutritionalDiagnostic);
      return right(
        Result.ok(this.mapper.toResponse(nutritionalAssessmentResult.val))
      );
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }
}
