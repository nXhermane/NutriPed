import {
  AnthroSystemCodes,
  DosageUnit,
  MEDICINE_CODES,
} from "@/core/constants";

import {
  SystemCode,
  Result,
  handleError,
  evaluateCondition,
  catchEvaluationError,
  ConditionResult,
  formatError,
} from "@/core/shared";

import {
  Amount,
  DosageRange,
  IDosageCase,
  MedicationDosageResult,
  Medicine,
} from "../models";

import {
  IMedicationDosageCalculator,
  MedicationDosageContext,
  MedicineRepository,
} from "../ports";

export class MedicationDosageCalculator implements IMedicationDosageCalculator {
  constructor(private readonly repo: MedicineRepository) {}
  async calculate(
    medicineCode: SystemCode<MEDICINE_CODES>,
    context: MedicationDosageContext
  ): Promise<Result<MedicationDosageResult>> {
    try {
      const medicine = await this.getMedicine(medicineCode);
      const selectedDosageCaseRes = this.selectAppropriateDosageCase(
        medicine.getDosageCases(),
        context
      );
      if (selectedDosageCaseRes.isFailure) {
        return Result.fail(
          formatError(selectedDosageCaseRes, MedicationDosageCalculator.name)
        );
      }
      const amount = this.getDailyDosage(selectedDosageCaseRes.val, context);
      const dosageRange = this.getDosageRange(
        selectedDosageCaseRes.val,
        context
      );
      if (!dosageRange) {
        return Result.fail("The dosage weight range is not supported.");
      }
      return MedicationDosageResult.create({
        dailyDosage: amount,
        dailyFrequency: selectedDosageCaseRes.val.base.unpack().frequency,
        dosage: dosageRange.unpack(),
      });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private async getMedicine(
    code: SystemCode<MEDICINE_CODES>
  ): Promise<Medicine> {
    return this.repo.getByCode(code);
  }
  private selectAppropriateDosageCase(
    dosageCases: IDosageCase[],
    context: MedicationDosageContext
  ): Result<IDosageCase> {
    try {
      for (const dosage of dosageCases) {
        const condition = dosage.condition.getCondition();
        const evaluationResult = catchEvaluationError(() =>
          evaluateCondition(condition.value, context as any)
        );
        if ("result" in evaluationResult) {
          if (evaluationResult.result === ConditionResult.True) {
            return Result.ok(dosage);
          }
        } else if ("variables" in evaluationResult) {
          throw new Error(
            `The variable missing error. La variable ${evaluationResult.variables?.variableName} (${dosage.condition.unpack().variablesExplanation[evaluationResult.variables?.variableName as string]}) n'est pas disponible. [Error]:${evaluationResult.message}.`
          );
        } else {
          throw new Error(evaluationResult.message);
        }
      }
      return Result.fail("dosage case not found for this context.");
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private getDailyDosage(
    dosageCase: IDosageCase,
    context: MedicationDosageContext
  ): Amount {
    const { min, max, unit } = dosageCase.base.unpack();
    if (DosageUnit.UI !== unit) {
      const minValue = min * context[AnthroSystemCodes.WEIGHT];
      const maxValue = max * context[AnthroSystemCodes.WEIGHT];
      return minValue === maxValue
        ? { value: minValue, unit: unit }
        : { maxValue, minValue, unit: unit };
    } else {
      return min === max
        ? { value: max, unit }
        : { maxValue: max, minValue: min, unit };
    }
  }
  private getDosageRange(
    dosageCase: IDosageCase,
    context: MedicationDosageContext
  ): DosageRange | undefined {
    const dosageRanges = dosageCase.ranges;
    return dosageRanges.find(
      range =>
        range.unpack().weightRange.min <= context[AnthroSystemCodes.WEIGHT] &&
        range.unpack().weightRange.max > context[AnthroSystemCodes.WEIGHT]
    );
  }
}
