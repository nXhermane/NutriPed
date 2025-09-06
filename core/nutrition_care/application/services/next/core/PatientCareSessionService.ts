/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppServiceResponse, Message, UseCase } from "@shared";
import { IPatientCareSessionServiceNext } from "../../interfaces";
import {
  GetPatientCareSessionRequest,
  GetPatientCareSessionResponse,
} from "../../../useCases/next/core/patientCareSession";
import { PatientCareSessionAggregateDto } from "../../../dtos";

export interface PatientCareSessionServiceUseCases {
  getPatientCareSessionUC: UseCase<
    GetPatientCareSessionRequest,
    GetPatientCareSessionResponse
  >;
}

export class PatientCareSessionService implements IPatientCareSessionServiceNext {
  constructor(private readonly ucs: PatientCareSessionServiceUseCases) {}

  async getPatientCareSession(
    req: GetPatientCareSessionRequest
  ): Promise<AppServiceResponse<PatientCareSessionAggregateDto> | Message> {
    const res = await this.ucs.getPatientCareSessionUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
