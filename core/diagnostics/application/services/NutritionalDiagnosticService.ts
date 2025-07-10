/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import {
  AddNoteToNutritionalDiagnosticRequest,
  AddNoteToNutritionalDiagnosticResponse,
  CorrectDiagnosticResultRequest,
  CorrectDiagnosticResultResponse,
  CreateNutritionalDiagnosticRequest,
  CreateNutritionalDiagnosticResponse,
  DeleteNutritionalDiagnosticRequest,
  DeleteNutritionalDiagnosticResponse,
  GenerateDiagnosticResultRequest,
  GenerateDiagnosticResultResponse,
  GetNutritionalDiagnosticRequest,
  GetNutritionalDiagnosticResponse,
  UpdatePatientDiagnosticDataRequest,
  UpdatePatientDiagnosticDataResponse,
} from "../useCases";
import { INutritionalDiagnosticService } from "./interfaces";
import {
  NutritionalAssessmentResultDto,
  NutritionalDiagnosticDto,
  PatientDiagnosticDataDto,
} from "../dtos";

export interface NutritionalDiagnosticServiceUseCases {
  createUC: UseCase<
    CreateNutritionalDiagnosticRequest,
    CreateNutritionalDiagnosticResponse
  >;
  getUC: UseCase<
    GetNutritionalDiagnosticRequest,
    GetNutritionalDiagnosticResponse
  >;
  deleteUC: UseCase<
    DeleteNutritionalDiagnosticRequest,
    DeleteNutritionalDiagnosticResponse
  >;
  addNotesUC: UseCase<
    AddNoteToNutritionalDiagnosticRequest,
    AddNoteToNutritionalDiagnosticResponse
  >;
  generateDiagnosticResultUC: UseCase<
    GenerateDiagnosticResultRequest,
    GenerateDiagnosticResultResponse
  >;
  updatePatientDiagnosticDataUC: UseCase<
    UpdatePatientDiagnosticDataRequest,
    UpdatePatientDiagnosticDataResponse
  >;
  correctDiagnosticResultUC: UseCase<
    CorrectDiagnosticResultRequest,
    CorrectDiagnosticResultResponse
  >;
}

export class NutritionalDiagnosticService
  implements INutritionalDiagnosticService
{
  constructor(private readonly ucs: NutritionalDiagnosticServiceUseCases) {}
  async create(
    req: CreateNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async get(
    req: GetNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<NutritionalDiagnosticDto[]> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async addNotes(
    req: AddNoteToNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<void> | Message> {
    const res = await this.ucs.addNotesUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async generateDiagnosticResult(
    req: GenerateDiagnosticResultRequest
  ): Promise<AppServiceResponse<NutritionalAssessmentResultDto> | Message> {
    const res = await this.ucs.generateDiagnosticResultUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async updatePatientDiagnosticData(
    req: UpdatePatientDiagnosticDataRequest
  ): Promise<AppServiceResponse<PatientDiagnosticDataDto> | Message> {
    const res = await this.ucs.updatePatientDiagnosticDataUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async correctDiagnosticResult(
    req: CorrectDiagnosticResultRequest
  ): Promise<AppServiceResponse<boolean> | Message> {
    const res = await this.ucs.correctDiagnosticResultUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async delete(
    req: DeleteNutritionalDiagnosticRequest
  ): Promise<AppServiceResponse<NutritionalDiagnosticDto> | Message> {
    const res = await this.ucs.deleteUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
