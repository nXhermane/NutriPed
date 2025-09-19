import { MessageDto } from "@/core/nutrition_care/application/dtos/next/core";
import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type GetPendingMessagesResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    messages: MessageDto[];
    count: number;
  }>
>;
