import { ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../common";

export interface NutritionalRiskFactorPersistenceDto extends EntityPersistenceDto {
   clinicalSignCode: string;
   associatedNutrients: { nutrient: string; effect: "deficiency" | "excess" }[]
   modulatingCondition: ICondition;
   recommendedTests: { testName: string; reason: string }[];
}
