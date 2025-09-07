/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { ICompletionService } from "../../interfaces";
import {
  CompleteActionRequest,
  CompleteActionResponse,
  CompleteTaskRequest,
  CompleteTaskResponse,
  HandleCompletionResponseRequest,
  HandleCompletionResponseResponse,
  MarkRecordIncompleteRequest,
  MarkRecordIncompleteResponse,
} from "../../../useCases/next/core/completion";

export interface CompletionServiceUseCases {
  completeActionUC: UseCase<CompleteActionRequest, CompleteActionResponse>;
  completeTaskUC: UseCase<CompleteTaskRequest, CompleteTaskResponse>;
  handleCompletionResponseUC: UseCase<
    HandleCompletionResponseRequest,
    HandleCompletionResponseResponse
  >;
  markRecordIncompleteUC: UseCase<
    MarkRecordIncompleteRequest,
    MarkRecordIncompleteResponse
  >;
}

export class CompletionService implements ICompletionService {
  constructor(private readonly ucs: CompletionServiceUseCases) {}

  async completeAction(
    req: CompleteActionRequest
  ): Promise<
    | AppServiceResponse<{
        sessionId: AggregateID;
        actionId: AggregateID;
        success: boolean;
        message: string;
      }>
    | Message
  > {
    const res = await this.ucs.completeActionUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async completeTask(
    req: CompleteTaskRequest
  ): Promise<
    | AppServiceResponse<{
        sessionId: AggregateID;
        taskId: AggregateID;
        success: boolean;
        message: string;
      }>
    | Message
  > {
    const res = await this.ucs.completeTaskUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async handleCompletionResponse(
    req: HandleCompletionResponseRequest
  ): Promise<
    | AppServiceResponse<{
        sessionId: AggregateID;
        success: boolean;
        message: string;
      }>
    | Message
  > {
    const res = await this.ucs.handleCompletionResponseUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async markRecordIncomplete(
    req: MarkRecordIncompleteRequest
  ): Promise<
    | AppServiceResponse<{
        sessionId: AggregateID;
        success: boolean;
        message: string;
      }>
    | Message
  > {
    const res = await this.ucs.markRecordIncompleteUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
