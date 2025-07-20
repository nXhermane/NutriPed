import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  AddNoteToNutritionalDiagnosticRequest,
  CorrectDiagnosticResultRequest,
  CreateNutritionalDiagnosticRequest,
  DeleteNutritionalDiagnosticRequest,
  GenerateDiagnosticResultRequest,
  GetNutritionalDiagnosticRequest,
  MakeIndependantDiagnosticRequest,
  UpdatePatientDiagnosticDataRequest,
} from "../../useCases";
import {
  NutritionalAssessmentResultDto,
  NutritionalDiagnosticDto,
  PatientDiagnosticDataDto,
} from "../../dtos";

export interface INutritionalDiagnosticService {
  create(
    req: CreateNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(
    req: GetNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<NutritionalDiagnosticDto[]> | Message>;
  updatePatientDiagnosticData(
    req: UpdatePatientDiagnosticDataRequest
  ): Promise<AppServiceResponse<PatientDiagnosticDataDto> | Message>;
  generateDiagnosticResult(
    req: GenerateDiagnosticResultRequest
  ): Promise<AppServiceResponse<NutritionalAssessmentResultDto> | Message>;
  correctDiagnosticResult(
    req: CorrectDiagnosticResultRequest
  ): Promise<AppServiceResponse<boolean> | Message>;
  addNotes(
    req: AddNoteToNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<void> | Message>;
  delete(
    req: DeleteNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<NutritionalDiagnosticDto> | Message>;
  makeIndependanteDiagnostic(
    req: MakeIndependantDiagnosticRequest
  ): Promise<AppServiceResponse<NutritionalAssessmentResultDto> | Message>;
}
