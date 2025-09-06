import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type ResumePatientCareSessionResponse = Either<
  ExceptionBase | unknown,
  Result<{ sessionId: AggregateID; status: string | undefined }>
>;
