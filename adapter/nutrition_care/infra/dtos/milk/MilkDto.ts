import {
  MilkType,
  RecommendedMilkPerDay,
  IRecommendedMilkPerWeightRange,
} from "@core/nutrition_care";
import { IFormula, ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";

export interface MilkPersistenceDto extends EntityPersistenceDto {
  name: string;
  type: MilkType;
  doseFormula: IFormula;
  condition: ICondition;
  recommendedMilkPerDay: RecommendedMilkPerDay[];
  recommendationPerRanges: IRecommendedMilkPerWeightRange[];
}
