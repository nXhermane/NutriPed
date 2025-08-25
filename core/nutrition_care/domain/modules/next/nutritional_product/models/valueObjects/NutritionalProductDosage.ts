import {
  DosageFormulaUnit,
  FeedingFrequenciePerDay,
  NUTRITIONAL_PRODUCT_CODE,
} from "@/core/constants";
import {
  ArgumentNotProvidedException,
  formatError,
  Guard,
  handleError,
  NegativeValueError,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";

export type CalculatedQuantity = {
  minValue: number;
  maxValue: number | null;
  unit: DosageFormulaUnit;
};
export type RecommendedQuantity = {
  values: Partial<Record<FeedingFrequenciePerDay, number>>;
  unit: DosageFormulaUnit;
};
export interface INutritionalProductDosage {
  productType: SystemCode<NUTRITIONAL_PRODUCT_CODE>;
  calculatedQuantity: CalculatedQuantity;
  recommendedQuantity: RecommendedQuantity;
  feedingFrequencies: FeedingFrequenciePerDay[];
}

export interface CreateNutritionalProductDosage {
  productType: NUTRITIONAL_PRODUCT_CODE;
  calculatedQuantity: CalculatedQuantity;
  recommendedQuantity: RecommendedQuantity;
  feedingFrequencies: FeedingFrequenciePerDay[];
}
export class NutritionalProductDosage extends ValueObject<INutritionalProductDosage> {
  getCalculatedQuantity(): CalculatedQuantity {
    return this.props.calculatedQuantity;
  }
  getRecommendedQuantity(): RecommendedQuantity {
    return this.props.recommendedQuantity;
  }
  getFeedingFrequencies(): FeedingFrequenciePerDay[] {
    return this.props.feedingFrequencies;
  }
  protected validate(props: Readonly<INutritionalProductDosage>): void {
    if (
      Guard.isNegative(props.calculatedQuantity.minValue).succeeded ||
      (Guard.isNumber(props.calculatedQuantity.maxValue).succeeded &&
        Guard.isNegative(props.calculatedQuantity.maxValue as number).succeeded)
    ) {
      throw new NegativeValueError(
        "The dosage calculated value can't not be negative value."
      );
    }
    if (Guard.isEmpty(props.feedingFrequencies).succeeded) {
      throw new ArgumentNotProvidedException(
        "The feeding frequencies must be provided."
      );
    }
  }
  static create(
    createProps: CreateNutritionalProductDosage
  ): Result<NutritionalProductDosage> {
    try {
      const productCodeRes = SystemCode.create(createProps.productType);
      if (productCodeRes.isFailure) {
        return Result.fail(
          formatError(productCodeRes, NutritionalProductDosage.name)
        );
      }
      return Result.ok(
        new NutritionalProductDosage({
          productType: productCodeRes.val,
          calculatedQuantity: createProps.calculatedQuantity,
          feedingFrequencies: createProps.feedingFrequencies,
          recommendedQuantity: createProps.recommendedQuantity,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
