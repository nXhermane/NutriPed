import { NutritionalProductDosageDto } from "@/core/nutrition_care/application/dtos/next/nutritional_products/services";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type EvaluateNutritionalProductResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalProductDosageDto>
>;
