/**
 * @fileoverview Value object representing the results of clinical nutritional analysis.
 *
 * Key components:
 * - clinicalSign: The identified clinical sign
 * - suspectedNutrients: List of nutrients that may be deficient/excess
 * - recommendedTests: Suggested biochemical tests for confirmation
 *
 * Used to capture the nutritional interpretation of observed clinical signs
 * and guide further investigation through recommended tests.
 */

import {
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@shared";
import { CreateNutrientImpact, NutrientImpact } from "./NutrientImpact";
import { IRecommendedTest, RecommendedTest } from "./RecommendedTest";

export interface IClinicalNutritionalAnalysisResult {
  signCode: SystemCode;
  suspectedNutrients: NutrientImpact[];
  recommendedTests: RecommendedTest[];
}
export interface CreateClinicalNutritionalAnalysisResultProps {
  signCode: string;
  suspectedNutrients: CreateNutrientImpact[];
  recommendedTests: IRecommendedTest[];
}
export class ClinicalNutritionalAnalysisResult extends ValueObject<IClinicalNutritionalAnalysisResult> {
  getSignCode(): string {
    return this.props.signCode.unpack();
  }
  getSuspectedNutrients(): CreateNutrientImpact[] {
    return this.props.suspectedNutrients.map(nutrient => ({
      effect: nutrient.getEffect(),
      nutrient: nutrient.getNutient(),
    }));
  }
  getRecommendedTests(): IRecommendedTest[] {
    return this.props.recommendedTests.map(recommendedTest =>
      recommendedTest.unpack()
    );
  }

  protected validate(
    props: Readonly<IClinicalNutritionalAnalysisResult>
  ): void {
    // Validation code
  }

  static create(
    props: CreateClinicalNutritionalAnalysisResultProps
  ): Result<ClinicalNutritionalAnalysisResult> {
    try {
      const clinicalSign = SystemCode.create(props.signCode);
      const suspectedNutrients = props.suspectedNutrients.map(
        NutrientImpact.create
      );
      const recommendedTests = props.recommendedTests.map(
        RecommendedTest.create
      );
      const combinedRes = Result.combine([
        clinicalSign,
        ...suspectedNutrients,
        ...recommendedTests,
      ]);
      if (combinedRes.isFailure)
        return Result.fail(
          formatError(combinedRes, ClinicalNutritionalAnalysisResult.name)
        );
      return Result.ok(
        new ClinicalNutritionalAnalysisResult({
          signCode: clinicalSign.val,
          suspectedNutrients: suspectedNutrients.map(nutrient => nutrient.val),
          recommendedTests: recommendedTests.map(test => test.val),
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
