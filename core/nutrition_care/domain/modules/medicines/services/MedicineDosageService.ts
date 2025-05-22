import { Result, handleError } from "@shared";
import {
  Amount,
  DosageUnit,
  IDosageRange,
  Medicine,
  MedicineDosageResult,
} from "../models";
import { IMedicineDosageService } from "../ports";
import { AnthroSystemCodes } from "../../../../../constants";

export class MedicineDosageService implements IMedicineDosageService {
  generateDosage(
    medicine: Medicine,
    context: { [AnthroSystemCodes.WEIGHT]: number }
  ): Result<MedicineDosageResult> {
    try {
      const dailyDosage = this.getMedicineDailyDosage(medicine, context);
      const dosageRange = this.getDosageRange(medicine, context);
      if (!dosageRange) {
        return Result.fail("The dosage weight range is not supported.");
      }
      return MedicineDosageResult.create({
        name: medicine.getName(),
        label: medicine.getBaseDosage().label,
        dailyDosage: dailyDosage,
        dailyDosageFrequency: medicine.getBaseDosage().frequency,
        code: medicine.getCode(),
        weightRangeDosage: dosageRange,
        administrationRoutes: medicine.getAdministrationRoutes(),
      });
    } catch (e) {
      return handleError(e);
    }
  }

  private getMedicineDailyDosage(
    medicine: Medicine,
    context: { [AnthroSystemCodes.WEIGHT]: number }
  ): Amount {
    const { min, max, unit } = medicine.getBaseDosage();
    if (DosageUnit.UI != unit) {
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
    medicine: Medicine,
    context: { [AnthroSystemCodes.WEIGHT]: number }
  ): IDosageRange | undefined {
    const dosageRanges = medicine.getDosageRanges();
    return dosageRanges.find(
      range =>
        range.weightRange.min <= context[AnthroSystemCodes.WEIGHT] &&
        range.weightRange.max > context[AnthroSystemCodes.WEIGHT]
    );
  }
}
