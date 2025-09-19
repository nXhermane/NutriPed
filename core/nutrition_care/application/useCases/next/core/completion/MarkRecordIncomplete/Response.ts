import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type MarkRecordIncompleteResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    success: boolean;
    message: string;
  }>
>;
