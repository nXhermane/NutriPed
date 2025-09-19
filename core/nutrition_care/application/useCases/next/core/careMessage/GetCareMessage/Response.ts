import { Either, ExceptionBase, Result } from "@/core/shared";
import { MessageDto } from "@/core/nutrition_care/application/dtos/next/core";

export type GetCareMessageResponse = Either<
  ExceptionBase | unknown,
  Result<MessageDto>
>;
