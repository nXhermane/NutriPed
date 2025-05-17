import { ConditionResult, evaluateCondition, evaluateFormula, formatError, handleError, Result } from "@shared";
import { IRecommendedMilkPerWeightRange, Milk, MilkSuggestionResult, RecommendedMilkPerDay } from "../models";
import { ITherapeuticMilkAdvisorService, MilkSuggestionInput } from "../ports";

export class TherapeuticMilkAdvisorService implements ITherapeuticMilkAdvisorService {
   constructor() {}
    suggest(input: MilkSuggestionInput, milks: Milk[]):Result<MilkSuggestionResult> {
      try {
         const milk = this.getMilkByCondition(input, milks);
         if (milk.isFailure) return Result.fail("Milk is not found.");
         const milkSuggestedResult = this.getMilkSuggestionResult(input, milk.val);
         if (milkSuggestedResult.isFailure) return Result.fail(formatError(milkSuggestedResult, TherapeuticMilkAdvisorService.name));
         return Result.ok(milkSuggestedResult.val);
      } catch (e) {
         return handleError(e);
      }
   }

   private getMilkByCondition(input: MilkSuggestionInput, milks: Milk[]): Result<Milk> {
      try {
         for (const milk of milks) {
            const condition = milk.getCondition();
            const conditionContext = condition.variables.reduce((context, variable) => {
               context[variable] = input[variable];
               return context;
            }, {} as Record<string, unknown>);
            const conditionRes = evaluateCondition(condition.value, conditionContext as never);
            if (conditionRes === ConditionResult.True) return Result.ok(milk);
         }
         return Result.fail("Appropriate milk not found.");
      } catch (e) {
         return handleError(e);
      }
   }

   private getMilkSuggestionResult(input: MilkSuggestionInput, milk: Milk): Result<MilkSuggestionResult> {
      try {
         const volumeFormula = milk.getDoseFormula();
         const volumeContext = volumeFormula.variables.reduce((context, variable) => {
            context[variable] = input[variable];
            return context;
         }, {} as Record<string, unknown>);
         const calculatedVolume = evaluateFormula(volumeFormula.value, volumeContext as never) as number;
         const recommendedRange = this.getRange(input, milk.getRanges());
         if (!recommendedRange) return Result.fail("The weight range not found.");
         const feedingFrequencies = Object.keys(recommendedRange.recommendedQuantityPerMilkRecommendationPerDay);
         const suggestedDailyVolume =
            Number(feedingFrequencies[0]) *
            recommendedRange.recommendedQuantityPerMilkRecommendationPerDay[feedingFrequencies[0] as RecommendedMilkPerDay]!;

         return MilkSuggestionResult.create({
            milkType: milk.getType(),
            calculatedVolumeMl: calculatedVolume,
            recommendedVolumeMl: suggestedDailyVolume,
            feedingFrequencies: feedingFrequencies as RecommendedMilkPerDay[],
         });
      } catch (e) {
         return handleError(e);
      }
   }
   private getRange(input: MilkSuggestionInput, ranges: IRecommendedMilkPerWeightRange[]): IRecommendedMilkPerWeightRange | undefined {
      return ranges.find((range) => {
         const { weightRange } = range;
         return weightRange.min <= input.weight && weightRange.max >= input.weight;
      });
   }
}
