import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  CompleteActionRequest,
  CompleteTaskRequest,
  HandleCompletionResponseRequest,
  MarkRecordIncompleteRequest,
} from "../../useCases/next/core/completion";

export interface ICompletionService {
  completeAction(
    req: CompleteActionRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; actionId: AggregateID; success: boolean; message: string }> | Message>;

  completeTask(
    req: CompleteTaskRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; taskId: AggregateID; success: boolean; message: string }> | Message>;

  handleCompletionResponse(
    req: HandleCompletionResponseRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; success: boolean; message: string }> | Message>;

  markRecordIncomplete(
    req: MarkRecordIncompleteRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; success: boolean; message: string }> | Message>;
}
