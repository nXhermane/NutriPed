import { NextCoreDtos } from "@/core/nutrition_care/application/dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetDailyCareRecordResponse = Either<
  ExceptionBase | unknown,
  Result<NextCoreDtos.DailyCareRecordDto>
>;
