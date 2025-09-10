import { AggregateID, Either, ExceptionBase, Result } from "@shared";

export type GenerateDailyCarePlanResponse = Either<
  ExceptionBase | unknown,
  Result<{
    sessionId: AggregateID;
    success: boolean;
    message: string;
    planGenerated: boolean;
  }>
>;
