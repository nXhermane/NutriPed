import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type StartContinuousOrchestrationResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    success: boolean;
    message: string;
    iterations?: number;
  }>
>;
