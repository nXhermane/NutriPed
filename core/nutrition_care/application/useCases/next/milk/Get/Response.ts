import { MilkDto } from "@/core/nutrition_care/application/dtos/next/milk";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetMilkResponse = Either<
  ExceptionBase | unknown,
  Result<MilkDto[]>
>;
