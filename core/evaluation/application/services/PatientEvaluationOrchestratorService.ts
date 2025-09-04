import {
  AggregateID,
  AppServiceResponse,
  Message,
  UseCase,
} from "@/core/shared";
import {
  AppetiteTestResultDto,
  GetAllPatientAppetiteTestResultRequest,
  GetAllPatientAppetiteTestResultResponse,
  GetLastPatientAppetiteTestResultRequest,
  GetLastPatientAppetiteTestResultResponse,
} from "../useCases";
import { IPatientEvaluationOrchestratorService } from "./interfaces";

export interface PatientEvaluationOrchestratorServiceUseCases {
  getAllAppetiteTest: UseCase<
    GetAllPatientAppetiteTestResultRequest,
    GetAllPatientAppetiteTestResultResponse
  >;
  getLastAppetiteTest: UseCase<
    GetLastPatientAppetiteTestResultRequest,
    GetLastPatientAppetiteTestResultResponse
  >;
}

export class PatientEvaluationOrchestratorService
  implements IPatientEvaluationOrchestratorService
{
  constructor(
    private readonly ucs: PatientEvaluationOrchestratorServiceUseCases
  ) {}
  async getAllPatientAppetiteTest(
    req: GetAllPatientAppetiteTestResultRequest
  ): Promise<
    | AppServiceResponse<(AppetiteTestResultDto & { id: AggregateID })[]>
    | Message
  > {
    const res = await this.ucs.getAllAppetiteTest.execute(req);
    if (res.isRight()) return { data: res.value.val };
    return new Message("error", JSON.stringify((res.value as any)?.err));
  }
  async getLastPatientAppetiteTest(
    req: GetLastPatientAppetiteTestResultRequest
  ): Promise<AppServiceResponse<AppetiteTestResultDto> | Message> {
    const res = await this.ucs.getLastAppetiteTest.execute(req);
    if (res.isRight()) return { data: res.value.val };
    return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
