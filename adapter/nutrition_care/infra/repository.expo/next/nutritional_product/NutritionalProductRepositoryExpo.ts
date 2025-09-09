import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { NutritionalProductPersistenceDto } from "../../../dtos/next/nutritional_product";
import { next_nutritional_products } from "../../db/nutrition_care.schema";
import { NextNutritionCare } from "@/core/nutrition_care";

export class NutritionalProductRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    NextNutritionCare.NutritionalProduct,
    NutritionalProductPersistenceDto,
    typeof next_nutritional_products
  >
  implements NextNutritionCare.NutritionalProductRepository {}
