import {
  admissionVariable,
  AnthroSystemCodes,
  DosageFormulaUnit,
  FeedingFrequenciePerDay,
  NUTRITIONAL_PRODUCT_CODE,
} from "@/core/constants";
import {
  CalculatedQuantity,
  ConditionalDosageFormula,
  DosageByWeight,
  IDosageScenario,
  NutritionalProduct,
  NutritionalProductDosage,
  RecommendedQuantity,
} from "../models";
import {
  INutritionalProductAdvisorService,
  NutritionalProductAdvisorContext,
  NutritionalProductRepository,
} from "../ports";
import {
  catchEvaluationError,
  ConditionResult,
  evaluateCondition,
  evaluateFormula,
  formatError,
  getResultFormCatchEvaluationResult,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";

export class NutritionalProductAdvisorService
  implements INutritionalProductAdvisorService
{
  constructor(
    private readonly nutritionalProductRepository: NutritionalProductRepository
  ) {}

  async evaluate(
    context: NutritionalProductAdvisorContext,
    adjustmentPercentage?: number
  ): Promise<Result<NutritionalProductDosage>> {
    try {
      const products = await this.getAllNutritionalProducts();
      for (const product of products) {
        const isApplicableResult = this.checkIfApplicable(product, context);
        if (isApplicableResult.isFailure) {
          return Result.fail(
            formatError(
              isApplicableResult,
              NutritionalProductAdvisorService.name
            )
          );
        }
        if (isApplicableResult.val === null) {
          continue;
        }
        const dosageScenario = isApplicableResult.val;
        return this.getDosageFromDosageScenario(
          dosageScenario,
          product.getCode(),
          context,
          adjustmentPercentage
        );
      }
      return Result.fail("Product not found.");
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  async getDosage(
    productCode: SystemCode<NUTRITIONAL_PRODUCT_CODE>,
    context: NutritionalProductAdvisorContext,
    adjustmentPercentage: number = 100
  ): Promise<Result<NutritionalProductDosage>> {
    try {
      const product = await this.getNutritionalProductByCode(productCode);
      const dosageScenarioRes = this.checkIfApplicable(product, context);
      if (dosageScenarioRes.isFailure) {
        return Result.fail(
          formatError(dosageScenarioRes, NutritionalProductAdvisorService.name)
        );
      }
      if (dosageScenarioRes.val === null) {
        return Result.fail("This product is not usable in this context.");
      }
      return this.getDosageFromDosageScenario(
        dosageScenarioRes.val,
        product.getCode(),
        context,
        adjustmentPercentage
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private async getAllNutritionalProducts(): Promise<NutritionalProduct[]> {
    return this.nutritionalProductRepository.getAll();
  }
  private async getNutritionalProductByCode(
    code: SystemCode<NUTRITIONAL_PRODUCT_CODE>
  ): Promise<NutritionalProduct> {
    return this.nutritionalProductRepository.getByCode(code);
  }
  private getDosageFromDosageScenario(
    dosageScenario: IDosageScenario,
    productType: NUTRITIONAL_PRODUCT_CODE,
    context: NutritionalProductAdvisorContext,
    adjustmentPercentage: number = 100
  ): Result<NutritionalProductDosage> {
    try {
      const computedDosageRes = this.getComputedDosage(
        dosageScenario.conditionalDosageFormulas,
        context,
        adjustmentPercentage
      );
      if (computedDosageRes.isFailure) {
        return Result.fail(
          formatError(computedDosageRes, NutritionalProductAdvisorService.name)
        );
      }
      const recommendedQuantityRes = this.getRecommededDosage(
        dosageScenario,
        context,
        adjustmentPercentage
      );
      if (recommendedQuantityRes.isFailure) {
        return Result.fail(
          formatError(
            recommendedQuantityRes,
            NutritionalProductAdvisorService.name
          )
        );
      }
      return NutritionalProductDosage.create({
        calculatedQuantity: computedDosageRes.val,
        feedingFrequencies: Object.keys(
          dosageScenario.dosages[0].getDosePerMeal()
        ) as FeedingFrequenciePerDay[],
        productType,
        recommendedQuantity: recommendedQuantityRes.val,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private getComputedDosage(
    conditionalFormulas: ConditionalDosageFormula[],
    context: NutritionalProductAdvisorContext,
    adjustmentPercentage: number = 100
  ): Result<CalculatedQuantity> {
    try {
      const isApplicableFormula = conditionalFormulas.find(formula => {
        const applicabilitiesCriterias = formula.unpack().applicabilities;
        for (const criteria of applicabilitiesCriterias) {
          const condition = criteria.getCondition().value;
          const evaluationResult = catchEvaluationError(() =>
            evaluateCondition(condition, context)
          );
          const conditionResult = getResultFormCatchEvaluationResult(
            evaluationResult,
            criteria.getVariablesExplanation()
          );
          if (conditionResult === ConditionResult.True) {
            return true;
          }
        }
        return false;
      });
      if (!isApplicableFormula) {
        return Result.fail("No applicable dosage formula found.");
      }
      const dosageFormula = isApplicableFormula.unpack().formula.unpack();
      const minDosageRes = this.evaluateFormula(
        dosageFormula.min.unpack().value,
        dosageFormula.variablesExplanation,
        context
      );
      const maxDosageRes =
        dosageFormula.max !== null
          ? this.evaluateFormula(
              dosageFormula.max.unpack().value,
              dosageFormula.variablesExplanation,
              context
            )
          : Result.ok(null);
      if (minDosageRes.isFailure || maxDosageRes.isFailure) {
        return Result.fail(`The dosage formula evaluation failed `);
      }
      return Result.ok({
        maxValue:
          maxDosageRes.val !== null
            ? (maxDosageRes.val * adjustmentPercentage) / 100
            : null,
        minValue: (minDosageRes.val * adjustmentPercentage) / 100,
        unit: dosageFormula.unit,
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private getRecommededDosage(
    dosageScenario: IDosageScenario,
    context: NutritionalProductAdvisorContext,
    adjustmentPercentage: number = 100
  ): Result<RecommendedQuantity> {
    try {
      const weight =
        dosageScenario.isAdmissionWeight === true
          ? context[admissionVariable(AnthroSystemCodes.WEIGHT)]
          : context[AnthroSystemCodes.WEIGHT];
      const dosageRes = this.getDosageByWeight(dosageScenario.dosages, weight);
      if (dosageRes.isFailure) {
        return Result.fail(
          formatError(dosageRes, NutritionalProductAdvisorService.name)
        );
      }
      const dosage = dosageRes.val;
      const values: RecommendedQuantity["values"] = Object.fromEntries(
        (Object.keys(dosage.getDosePerMeal()) as FeedingFrequenciePerDay[]).map(
          (feedingPerDay: FeedingFrequenciePerDay) => {
            // recommendedValue ==> 100
            // adjustedValue ==> adjustemenPercentatge
            // adjustedValue = adjustemenPercentatge * recommededValue / 100 ;
            const recommededValue =
              (Number(feedingPerDay) *
                dosage.getDosePerMeal()[feedingPerDay]! *
                adjustmentPercentage) /
              100;
            return [feedingPerDay, recommededValue];
          }
        )
      );
      return Result.ok({
        values,
        unit: DosageFormulaUnit.ML, // BETA: On se permet de mettre juste ml la
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private getDosageByWeight(
    dosages: DosageByWeight[],
    weight: number
  ): Result<DosageByWeight> {
    try {
      let leftIndex = 0;
      let rightIndex = dosages.length - 1;
      while (leftIndex <= rightIndex) {
        const midIndex = Math.floor(leftIndex + rightIndex) / 2;
        const midValue = dosages[midIndex]?.getWeight();
        const midLeftValue = dosages[midIndex - 1]?.getWeight();
        const midRightValue = dosages[midIndex + 1]?.getWeight();
        if (midValue === weight) {
          return Result.ok(dosages[midIndex]);
        } else if (midValue > weight && midLeftValue < weight) {
          return Result.ok(dosages[midIndex - 1]);
        } else if (midValue < weight && midRightValue > weight) {
          return Result.ok(dosages[midIndex + 1]);
        } else if (midValue < weight) {
          leftIndex = midIndex + 1;
        } else {
          rightIndex = midIndex - 1;
        }
      }
      return Result.fail("The dosage weight range not found.");
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private checkIfApplicable(
    product: NutritionalProduct,
    context: NutritionalProductAdvisorContext
  ): Result<IDosageScenario | null> {
    try {
      const dosageTables = product.getTables();
      for (const table of dosageTables) {
        const applicabilityCriteria = table.applicability;
        const isApplicableRes = Result.encapsulate(() => {
          const condition = applicabilityCriteria.getCondition();
          const conditionResult = catchEvaluationError(() =>
            evaluateCondition(condition.value, context)
          );
          return (
            getResultFormCatchEvaluationResult(
              conditionResult,
              applicabilityCriteria.getVariablesExplanation()
            ) === ConditionResult.True
          );
        });
        if (isApplicableRes.isFailure) {
          return Result.fail(
            formatError(isApplicableRes, NutritionalProductAdvisorService.name)
          );
        }
        if (isApplicableRes.val) {
          return Result.ok(table);
        }
      }
      return Result.ok(null);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private evaluateFormula(
    formula: string,
    variablesExplanation: Record<string, string>,
    context: NutritionalProductAdvisorContext
  ): Result<number> {
    try {
      const evaluationResult = catchEvaluationError(() =>
        evaluateFormula(formula, context)
      );
      return Result.ok(
        getResultFormCatchEvaluationResult(
          evaluationResult,
          variablesExplanation
        ) as number
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
