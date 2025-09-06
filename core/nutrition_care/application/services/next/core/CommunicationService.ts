/* eslint-disable @typescript-eslint/no-explicit-any */
import { AggregateID, AppServiceResponse, Message, UseCase } from "@shared";
import { ICommunicationService } from "../../interfaces";
import {
  GetPendingMessagesRequest,
  GetPendingMessagesResponse,
  SubmitUserResponseRequest,
  SubmitUserResponseResponse,
} from "../../../useCases/next/core/communication";

export interface CommunicationServiceUseCases {
  getPendingMessagesUC: UseCase<
    GetPendingMessagesRequest,
    GetPendingMessagesResponse
  >;
  submitUserResponseUC: UseCase<
    SubmitUserResponseRequest,
    SubmitUserResponseResponse
  >;
}

export class CommunicationService implements ICommunicationService {
  constructor(private readonly ucs: CommunicationServiceUseCases) {}

  async getPendingMessages(
    req: GetPendingMessagesRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; messages: any[] }> | Message> {
    const res = await this.ucs.getPendingMessagesUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }

  async submitUserResponse(
    req: SubmitUserResponseRequest
  ): Promise<AppServiceResponse<{ sessionId: AggregateID; messageId: AggregateID; success: boolean; message: string }> | Message> {
    const res = await this.ucs.submitUserResponseUC.execute(req);
    if (res.isRight()) return { data: res.value.val };
    else return new Message("error", JSON.stringify((res.value as any)?.err));
  }
}
