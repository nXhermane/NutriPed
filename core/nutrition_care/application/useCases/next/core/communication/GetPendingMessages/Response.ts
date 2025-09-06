import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type GetPendingMessagesResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    messages: any[];
    count: number;
  }>
>;
