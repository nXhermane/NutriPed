import { AggregateID, AppServiceResponse, Message } from "@shared";
import { GetPatientCareSessionRequest } from "../../useCases/next/core/patientCareSession";
import { PatientCareSessionAggregateDto } from "../../dtos";

export interface IPatientCareSessionServiceNext {
  getPatientCareSession(
    req: GetPatientCareSessionRequest
  ): Promise<AppServiceResponse<PatientCareSessionAggregateDto> | Message>;
}
