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
  EvaluationContext,
  INutritionalAssessmentService,
  NutritionalAssessmentResult,
  NutritionalDiagnosticRepository,
  PatientDiagnosticData,
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

      const patientData = nutritionalDiagnostic.getPatientData();
      const nutritionalAssessmentResult =
        await this.nutritionalAssessmentService.evaluateNutritionalStatus(
          this.generateContext(patientData),
          patientData.getAnthropometricData(),
          patientData.getClinicalSigns(),
          patientData.getBiologicalTestResults()
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
  private generateContext(
    patientData: PatientDiagnosticData
  ): EvaluationContext {
    return {
      age_in_day: patientData.age_in_day,
      age_in_month: patientData.age_in_month,
      age_in_year: patientData.age_in_year,
      sex: patientData.getGender().unpack(),
    };
  }
}
