import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  GenerateDailyCarePlanRequest,
  StartContinuousOrchestrationRequest,
  SynchronizePatientStateRequest,
} from "../../useCases/next/core/orchestration";

export interface IOrchestrationService {
  generateDailyCarePlan(
    req: GenerateDailyCarePlanRequest
  ): Promise<
    | AppServiceResponse<{
        sessionId: AggregateID;
        success: boolean;
        message: string;
        planGenerated: boolean;
      }>
    | Message
  >;

  startContinuousOrchestration(
    req: StartContinuousOrchestrationRequest
  ): Promise<
    | AppServiceResponse<{
        sessionId: AggregateID;
        success: boolean;
        message: string;
      }>
    | Message
  >;

  synchronizePatientState(
    req: SynchronizePatientStateRequest
  ): Promise<
    | AppServiceResponse<{
        sessionId: AggregateID;
        success: boolean;
        message: string;
      }>
    | Message
  >;
}
