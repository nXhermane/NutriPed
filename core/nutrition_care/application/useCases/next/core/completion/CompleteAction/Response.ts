import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CompleteActionResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    actionId: AggregateID;
    success: boolean;
    message: string;
  }>
>;
