import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type CompleteTaskResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    taskId: AggregateID;
    success: boolean;
    message: string;
  }>
>;
