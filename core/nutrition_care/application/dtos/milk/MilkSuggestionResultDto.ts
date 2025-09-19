import { MilkType, RecommendedMilkPerDay } from "../../../domain";

export interface MilkSuggestionResultDto {
  milkType: MilkType;
  calculatedVolumeMl: number;
  recommendedVolumeMl: number;
  feedingFrequencies: RecommendedMilkPerDay[];
}
