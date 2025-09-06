/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { IOrchestrationService } from "../../interfaces";
import {
  GenerateDailyCarePlanRequest,
  GenerateDailyCarePlanResponse,
  StartContinuousOrchestrationRequest,
  StartContinuousOrchestrationResponse,
  SynchronizePatientStateRequest,
  SynchronizePatientStateResponse,
} from "../../../useCases/next/core/orchestration";

export interface OrchestrationServiceUseCases {
  generateDailyCarePlanUC: UseCase<
    GenerateDailyCarePlanRequest,
    GenerateDailyCarePlanResponse
  >;
  startContinuousOrchestrationUC: UseCase<
    StartContinuousOrchestrationRequest,
    StartContinuousOrchestrationResponse
  >;
  synchronizePatientStateUC: UseCase<
    SynchronizePatientStateRequest,
    SynchronizePatientStateResponse
  >;
}

export class OrchestrationService implements IOrchestrationService {
  constructor(private readonly ucs: OrchestrationServiceUseCases) {}

  async generateDailyCarePlan(
    req: GenerateDailyCarePlanRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; success: boolean; message: string; planGenerated: boolean }> | Message> {
    const res = await this.ucs.generateDailyCarePlanUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async startContinuousOrchestration(
    req: StartContinuousOrchestrationRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; success: boolean; message: string }> | Message> {
    const res = await this.ucs.startContinuousOrchestrationUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async synchronizePatientState(
    req: SynchronizePatientStateRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; success: boolean; message: string }> | Message> {
    const res = await this.ucs.synchronizePatientStateUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
