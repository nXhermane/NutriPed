import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CreatePatientCareSessionRequest,
  GetPatientCareSessionRequest,
  AddDataToPatientCareSessionRequest,
  EvaluatePatientAppetiteRequest,
  OrientPatientRequest,
  MakePatientCareSessionReadyRequest,
  AppetiteTestResultDto,
  OrientationResultDto,
} from "../../useCases";
import { PatientCareSessionDto } from "../../dtos";

export interface IPatientCareSessionAppService {
  create(req: CreatePatientCareSessionRequest): Promise<AppServiceResponse<{ id: AggregateID }> | Message>;
  get(req: GetPatientCareSessionRequest): Promise<AppServiceResponse<PatientCareSessionDto> | Message>;
  addData(req: AddDataToPatientCareSessionRequest): Promise<AppServiceResponse<void> | Message>;
  evaluatePatientAppetite(req: EvaluatePatientAppetiteRequest): Promise<AppServiceResponse<AppetiteTestResultDto> | Message>;
  orientPatient(req: OrientPatientRequest): Promise<AppServiceResponse<OrientationResultDto> | Message>;
  makeCareSessionReady(req: MakePatientCareSessionReadyRequest): Promise<AppServiceResponse<boolean> | Message>;
}