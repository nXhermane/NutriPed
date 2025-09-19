import { NutritionalProductDto } from "@/core/nutrition_care/application/dtos/next/nutritional_products";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetNutritionalProductResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalProductDto[]>
>;
