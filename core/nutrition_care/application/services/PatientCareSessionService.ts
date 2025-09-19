/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IPatientCareSessionAppService } from "./interfaces";
import {
  CreatePatientCareSessionRequest,
  CreatePatientCareSessionResponse,
  GetPatientCareSessionRequest,
  GetPatientCareSessionResponse,
  AddDataToPatientCareSessionRequest,
  AddDataToPatientCareSessionResponse,
  EvaluatePatientAppetiteRequest,
  EvaluatePatientAppetiteResponse,
  OrientPatientRequest,
  OrientPatientResponse,
  MakePatientCareSessionReadyRequest,
  MakePatientCareSessionReadyResponse,
  AppetiteTestResultDto,
  OrientationResultDto,
  GetDailyJournalRequest,
  GetDailyJouranlResponse,
} from "../useCases";
import { DailyCareJournalDto, PatientCareSessionDto } from "../dtos";

export interface PatientCareSessionServiceUseCases {
  createUC: UseCase<
    CreatePatientCareSessionRequest,
    CreatePatientCareSessionResponse
  >;
  getUC: UseCase<GetPatientCareSessionRequest, GetPatientCareSessionResponse>;
  addDataUC: UseCase<
    AddDataToPatientCareSessionRequest,
    AddDataToPatientCareSessionResponse
  >;
  evaluatePatientAppetiteUC: UseCase<
    EvaluatePatientAppetiteRequest,
    EvaluatePatientAppetiteResponse
  >;
  orientPatientUC: UseCase<OrientPatientRequest, OrientPatientResponse>;
  makeCareSessionReadyUC: UseCase<
    MakePatientCareSessionReadyRequest,
    MakePatientCareSessionReadyResponse
  >;
  getDailyJournalsUC: UseCase<GetDailyJournalRequest, GetDailyJouranlResponse>;
}

export class PatientCareSessionAppService
  implements IPatientCareSessionAppService
{
  constructor(private readonly ucs: PatientCareSessionServiceUseCases) {}

  async create(
    req: CreatePatientCareSessionRequest
  ): Promise<AppServiceResponse<{ id: AggregateID }> | Message> {
    const res = await this.ucs.createUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async get(
    req: GetPatientCareSessionRequest
  ): Promise<AppServiceResponse<PatientCareSessionDto> | Message> {
    const res = await this.ucs.getUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async addData(
    req: AddDataToPatientCareSessionRequest
  ): Promise<AppServiceResponse<void> | Message> {
    const res = await this.ucs.addDataUC.execute(req);
    if (res.isRight()) return { data: void 0 };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async evaluatePatientAppetite(
    req: EvaluatePatientAppetiteRequest
  ): Promise<AppServiceResponse<AppetiteTestResultDto> | Message> {
    const res = await this.ucs.evaluatePatientAppetiteUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async orientPatient(
    req: OrientPatientRequest
  ): Promise<AppServiceResponse<OrientationResultDto> | Message> {
    const res = await this.ucs.orientPatientUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async makeCareSessionReady(
    req: MakePatientCareSessionReadyRequest
  ): Promise<AppServiceResponse<boolean> | Message> {
    const res = await this.ucs.makeCareSessionReadyUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async getDailyJournals(req: GetDailyJournalRequest): Promise<
    | AppServiceResponse<{
        current?: DailyCareJournalDto;
        previeous: DailyCareJournalDto[];
      }>
    | Message
  > {
    const res = await this.ucs.getDailyJournalsUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
