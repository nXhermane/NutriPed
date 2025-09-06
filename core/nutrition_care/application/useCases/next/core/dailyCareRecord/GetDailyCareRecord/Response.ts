import { Either, ExceptionBase, Result } from "@/core/shared";
import { DailyCareRecordDto } from "@/core/nutrition_care/application/dtos";

export type GetDailyCareRecordResponse = Either<
  ExceptionBase | unknown,
  Result<DailyCareRecordDto>
>;
