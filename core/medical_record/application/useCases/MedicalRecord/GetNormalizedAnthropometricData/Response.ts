import { CreateAnthropometricRecord } from "./../../../../domain";
import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";

export type GetNormalizedAnthropometricDataResponse = Either<
  ExceptionBase | unknown,
  Result<
    (CreateAnthropometricRecord & {
      recordedAt: string;
      id: AggregateID;
    })[]
  >
>;
