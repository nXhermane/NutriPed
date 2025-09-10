import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type SynchronizePatientStateResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    success: boolean;
    message: string;
    stateSynchronized: boolean;
  }>
>;
