import { Either, ExceptionBase, Result } from "@/core/shared";
import { CareMessageDto } from "@/core/nutrition_care/application/dtos";

export type GetCareMessageResponse = Either<
  ExceptionBase | unknown,
  Result<CareMessageDto>
>;
