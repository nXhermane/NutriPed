import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type GetPatientCareSessionStatusResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    completionStatus?: string;
    pendingItems?: any[];
    nextActions?: string[];
    currentRecord?: any;
  }>
>;
