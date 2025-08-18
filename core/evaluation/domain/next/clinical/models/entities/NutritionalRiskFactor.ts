/**
 * @fileoverview Entity representing the relationship between clinical signs
 * and potential nutritional deficiencies.
 *
 * @class NutritionalRiskFactor
 * @extends Entity<INutritionalRiskFactor>
 *
 * Key features:
 * - Maps clinical signs to potential nutrient deficiencies
 * - Defines conditions that modify risk assessment
 * - Specifies recommended biochemical tests
 * - Supports dynamic risk factor evaluation
 */

import {
  AggregateID,
  Condition,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  ICondition,
  Result,
  SystemCode,
} from "@shared";
import {
  INutrientImpact,
  IRecommendedTest,
  NutrientImpact,
  RecommendedTest,
} from "../valueObjects";

/**
 * - Exemple de situation
 *
 * | Signe Clinique | Suspected Nutrients | Modulateurs |
 * |----------------|---------------|-------------|
 * |pale_skin| Fer,VB12 | sex==="F" && age < 50 |
 * |pale_skin|Acide folique| grossesse=oui |
 * |pale_skin|Fer|Antecedent d'anemie |
 *
 */
export interface INutritionalRiskFactor extends EntityPropsBaseType {
  clinicalSignCode: SystemCode;
  associatedNutrients: NutrientImpact[];
  modulatingCondition: Condition;
  recommendedTests: RecommendedTest[];
}

export interface CreateNutritionalRiskFactorProps {
  clinicalSignCode: string;
  associatedNutrients: { nutrient: string; effect: "deficiency" | "excess" }[];
  modulatingCondition: ICondition;
  recommendedTests: IRecommendedTest[];
}

export class NutritionalRiskFactor extends Entity<INutritionalRiskFactor> {
  getClinicalSignCode(): string {
    return this.props.clinicalSignCode.unpack();
  }
  getAssociatedNutrients(): INutrientImpact[] {
    return this.props.associatedNutrients.map(nut => nut.unpack());
  }
  getModulatingCondition(): ICondition {
    return this.props.modulatingCondition.unpack();
  }
  getRecommendedTests(): IRecommendedTest[] {
    return this.props.recommendedTests.map(test => test.unpack());
  }
  changeClinicalSignCode(code: SystemCode) {
    this.props.clinicalSignCode = code;
    this.validate();
  }
  changeModulatingCondition(condition: Condition) {
    this.props.modulatingCondition = condition;
    this.validate();
  }
  changeAssociatedNutrients(associatedNutrients: NutrientImpact[]) {
    this.props.associatedNutrients = associatedNutrients;
    this.validate();
  }
  changeRecommendedTests(recommendedTests: RecommendedTest[]) {
    this.props.recommendedTests = recommendedTests;
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    // Validation Code
    this._isValid = true;
  }

  static create(
    createProps: CreateNutritionalRiskFactorProps,
    id: AggregateID
  ): Result<NutritionalRiskFactor> {
    try {
      const clinicalSignCodeRes = SystemCode.create(
        createProps.clinicalSignCode
      );
      const associatedNutrientsRes = createProps.associatedNutrients.map(
        NutrientImpact.create
      );
      const modulatingConditionRes = Condition.create(
        createProps.modulatingCondition
      );
      const recommendedTestsRes = createProps.recommendedTests.map(
        RecommendedTest.create
      );
      const combinedRes = Result.combine([
        clinicalSignCodeRes,
        modulatingConditionRes,
        ...associatedNutrientsRes,
        ...recommendedTestsRes,
      ]);
      if (combinedRes.isFailure)
        return Result.fail(
          formatError(combinedRes, NutritionalRiskFactor.name)
        );
      return Result.ok(
        new NutritionalRiskFactor({
          id,
          props: {
            clinicalSignCode: clinicalSignCodeRes.val,
            modulatingCondition: modulatingConditionRes.val,
            associatedNutrients: associatedNutrientsRes.map(res => res.val),
            recommendedTests: recommendedTestsRes.map(res => res.val),
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
