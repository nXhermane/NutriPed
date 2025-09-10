import { NUTRITIONAL_PRODUCT_CODE } from "@/core/constants";
import { CreateDosageScenario } from "@/core/nutrition_care/domain/modules/next";
import { AggregateID } from "@/core/shared";

export interface NutritionalProductPersistenceDto {
  id: AggregateID;
  code: NUTRITIONAL_PRODUCT_CODE;
  dosageTables: CreateDosageScenario[];
  createdAt: string;
  updatedAt: string;
}
