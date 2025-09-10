import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type SubmitUserResponseResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    messageId: AggregateID;
    success: boolean;
    message: string;
  }>
>;
