import { ArgumentNotProvidedException, ArgumentOutOfRangeException, Guard, handleError, NegativeValueError, Result, ValueObject } from "@shared";
import { RecommendedMilkPerDay } from "../constants";

export interface IRecommendedMilkPerWeightRange {
   weightRange: {
      min: number;
      max: number;
   };
   recommendedQuantityPerMilkRecommendationPerDay: Partial<Record<RecommendedMilkPerDay, number>>;
}

export class RecommendedMilkPerWeightRange extends ValueObject<IRecommendedMilkPerWeightRange> {
   protected validate(props: Readonly<IRecommendedMilkPerWeightRange>): void {
      if (Guard.isNegative(props.weightRange.min).succeeded || Guard.isNegative(props.weightRange.max).succeeded) {
         throw new NegativeValueError("The limit of weight range can't be negative.");
      }
      if (props.weightRange.min > props.weightRange.max) {
         throw new ArgumentOutOfRangeException("The max limit must be greater than the min limit in a weight range.");
      }
      if (Object.keys(props.recommendedQuantityPerMilkRecommendationPerDay).length == 0) {
         throw new ArgumentNotProvidedException("The weight range must have an recommended quantity.");
      }
   }
   static create(props: IRecommendedMilkPerWeightRange): Result<RecommendedMilkPerWeightRange> {
      try {
         return Result.ok(new RecommendedMilkPerWeightRange(props));
      } catch (e) {
         return handleError(e);
      }
   }
}
