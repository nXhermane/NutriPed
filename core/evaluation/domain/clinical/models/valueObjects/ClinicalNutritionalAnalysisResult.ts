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
import { NutrientImpact } from "./NutrientImpact";
import { IRecommendedTest, RecommendedTest } from "./RecommendedTest";

export interface IClinicalNutritionalAnalysisResult {
  clinicalSign: SystemCode;
  suspectedNutrients: NutrientImpact[];
  recommendedTests: RecommendedTest[];
}
export interface CreateClinicalNutritionalAnalysisResultProps {
  clinicalSign: string;
  suspectedNutrients: { nutrient: string; effect: "deficiency" | "excess" }[];
  recommendedTests: IRecommendedTest[];
}
export class ClinicalNutritionalAnalysisResult extends ValueObject<IClinicalNutritionalAnalysisResult> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validate(
    props: Readonly<IClinicalNutritionalAnalysisResult>
  ): void {
    // Validation code
  }

  static create(
    props: CreateClinicalNutritionalAnalysisResultProps
  ): Result<ClinicalNutritionalAnalysisResult> {
    try {
      const clinicalSign = SystemCode.create(props.clinicalSign);
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
          clinicalSign: clinicalSign.val,
          suspectedNutrients: suspectedNutrients.map(nutrient => nutrient.val),
          recommendedTests: recommendedTests.map(test => test.val),
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
