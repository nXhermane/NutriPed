import { AggregateID, ICondition, IFormula } from "@shared";
import {
  IRecommendedMilkPerWeightRange,
  MilkType,
  RecommendedMilkPerDay,
} from "../../../domain";

export interface MilkDto {
  id: AggregateID;
  name: string;
  type: MilkType;
  doseFormula: IFormula;
  condition: ICondition;
  recommendedMilkPerDay: RecommendedMilkPerDay[];
  recommendationPerRanges: IRecommendedMilkPerWeightRange[];
  createdAt: string;
  updatedAt: string;
}
