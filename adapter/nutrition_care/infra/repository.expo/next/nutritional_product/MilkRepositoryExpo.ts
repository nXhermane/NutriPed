import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { MilkPersistenceDto } from "../../../dtos/next/nutritional_product";
import { next_milks } from "../../db/nutrition_care.schema";
import { NextNutritionCare } from "@/core/nutrition_care";

export class MilkRepositoryExpo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    NextNutritionCare.Milk,
    MilkPersistenceDto,
    typeof next_milks
  >
  implements NextNutritionCare.MilkRepository {}
