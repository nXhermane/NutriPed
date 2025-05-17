import { ICondition } from "@shared";


export enum MilkType {
  F100 = "f100",
  F75 = "f75",
  F100Diluted = "f100_diluted",
}
export enum RecommendedMilkPerDay {
  HEIGHT = "8",
  FIVE = "5",
  SIX = "6",
}
export interface RecommendedMilkPerWeightRanges {
  weightRange: {
    min: number;
    max: number;
  };
  recommendedQuantityPerMilkRecommendationPerDay: Partial<
    Record<RecommendedMilkPerDay, number>
  >;
}
export interface Milk {
  name: string;
  type: MilkType;
  doseFormula: ICondition;
  condition: ICondition;
  recommendedMilkPerDay: RecommendedMilkPerDay[];
  notes: string[];
  recommendationPerRanges: RecommendedMilkPerWeightRanges[];
}
