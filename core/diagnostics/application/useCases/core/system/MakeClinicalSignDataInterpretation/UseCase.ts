import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { MakeClinicalSignDataInterpretationRequest } from "./Request";
import { MakeClinicalSignDataInterpretationResponse } from "./Response";
import {
  EvaluationContext,
  NutritionalDiagnosticRepository,
} from "./../../../../../domain";
import {
  MakeClinicalAnalysisRequest,
  MakeClinicalAnalysisResponse,
} from "../../../clinical";

export class MakeClinicalSignDataInterpretationUseCase
  implements
    UseCase<
      MakeClinicalSignDataInterpretationRequest,
      MakeClinicalSignDataInterpretationResponse
    >
{
  constructor(
    private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
    private readonly makeClinicalAnalysis: UseCase<
      MakeClinicalAnalysisRequest,
      MakeClinicalAnalysisResponse
    >
  ) {}
  async execute(
    request: MakeClinicalSignDataInterpretationRequest
  ): Promise<MakeClinicalSignDataInterpretationResponse> {
    try {
      const evaluationContext = await this.getPatientContext(request.patientId);
      const makeClinicalAnalysisResult =
        await this.makeClinicalAnalysis.execute({
          age_in_day: evaluationContext.age_in_day,
          age_in_month: evaluationContext.age_in_month,
          sex: evaluationContext.sex,
          clinicalSigns: request.signs,
        });
      if (makeClinicalAnalysisResult.isRight()) {
        const clinicalSignDataInterpretation: {
          code: string;
          isPresent: boolean;
        }[] = [];
        const analysisResult = makeClinicalAnalysisResult.value.val;
        for (const sign of request.signs) {
          const isPresent = !!analysisResult.find(
            presentSign => presentSign.clinicalSign === sign.code
          );
          clinicalSignDataInterpretation.push({ code: sign.code, isPresent });
        }
        return right(Result.ok(clinicalSignDataInterpretation));
      } else {
        return left(Result.fail(makeClinicalAnalysisResult.value as any).err);
      }
    } catch (e) {
      return left(handleError(e));
    }
  }
  private async getPatientContext(
    patientId: AggregateID
  ): Promise<EvaluationContext> {
    const medicalRecord =
      await this.nutritionalDiagnosticRepo.getByIdOrPatientId(patientId);
    const patientData = medicalRecord.getPatientData();
    return {
      age_in_day: patientData.age_in_day,
      age_in_month: patientData.age_in_month,
      age_in_year: patientData.age_in_year,
      sex: patientData.sex,
    };
  }
}
