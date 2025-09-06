import { Either, ExceptionBase, Result } from "@/core/shared";
import { DailyCareActionDto } from "@/core/nutrition_care/application/dtos";

export type GetDailyCareActionResponse = Either<
  ExceptionBase | unknown,
  Result<DailyCareActionDto>
>;
