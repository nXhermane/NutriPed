import { AggregateID, AppServiceResponse, Message } from "@/core/shared";
import {
  AppetiteTestResultDto,
  GetAllPatientAppetiteTestResultRequest,
  GetLastPatientAppetiteTestResultRequest,
} from "../../useCases";

export interface IPatientEvaluationOrchestratorService {
  getAllPatientAppetiteTest(
    req: GetAllPatientAppetiteTestResultRequest
  ): Promise<
    | AppServiceResponse<(AppetiteTestResultDto & { id: AggregateID })[]>
    | Message
  >;
  getLastPatientAppetiteTest(
    req: GetLastPatientAppetiteTestResultRequest
  ): Promise<AppServiceResponse<AppetiteTestResultDto> | Message>;
}
