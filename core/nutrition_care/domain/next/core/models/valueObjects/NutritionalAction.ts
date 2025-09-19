import {
  FeedingFrequenciePerDay,
  NUTRITIONAL_PRODUCT_CODE,
} from "@/core/constants";
import { NextNutritionCare } from "./../../../../modules";
import {
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";

export interface INutritionalAction {
  productType: SystemCode<NUTRITIONAL_PRODUCT_CODE>;
  calcultedQuantity: NextNutritionCare.CalculatedQuantity;
  recommendedQuantity: NextNutritionCare.RecommendedQuantity;
  feedingFrequencies: FeedingFrequenciePerDay[];
}

export interface CreateNutritionalAction {
  productType: NUTRITIONAL_PRODUCT_CODE;
  calcultedQuantity: NextNutritionCare.CalculatedQuantity;
  recommendedQuantity: NextNutritionCare.RecommendedQuantity;
  feedingFrequencies: FeedingFrequenciePerDay[];
}

export class NutritionalAction extends ValueObject<INutritionalAction> {
  getProductType(): NUTRITIONAL_PRODUCT_CODE {
    return this.props.productType.unpack();
  }
  getCalculatedQuantity(): NextNutritionCare.CalculatedQuantity {
    return this.props.calcultedQuantity;
  }
  getRecommendQuantity(): NextNutritionCare.RecommendedQuantity {
    return this.props.recommendedQuantity;
  }
  getFeedingFrequencies(): FeedingFrequenciePerDay[] {
    return this.props.feedingFrequencies;
  }

  protected validate(props: Readonly<INutritionalAction>): void {
    // Implement the validate rule if needed...
  }
  static create(
    createProps: CreateNutritionalAction
  ): Result<NutritionalAction> {
    try {
      const productTypeRes = SystemCode.create(createProps.productType);
      if (productTypeRes.isFailure) {
        return Result.fail(formatError(productTypeRes, NutritionalAction.name));
      }
      return Result.ok(
        new NutritionalAction({
          productType: productTypeRes.val,
          calcultedQuantity: createProps.calcultedQuantity,
          feedingFrequencies: createProps.feedingFrequencies,
          recommendedQuantity: createProps.recommendedQuantity,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
