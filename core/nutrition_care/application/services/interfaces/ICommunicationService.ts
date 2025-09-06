import { AggregateID, AppServiceResponse, Message } from "@shared";
import {
  GetPendingMessagesRequest,
  SubmitUserResponseRequest,
} from "../../useCases/next/core/communication";

export interface ICommunicationService {
  getPendingMessages(
    req: GetPendingMessagesRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; messages: any[] }> | Message>;

  submitUserResponse(
    req: SubmitUserResponseRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; messageId: AggregateID; success: boolean; message: string }> | Message>;
}
