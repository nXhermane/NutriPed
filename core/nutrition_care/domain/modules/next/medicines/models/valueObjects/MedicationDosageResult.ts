import { formatError, handleError, Result, ValueObject } from "@/core/shared";
import { Amount, DosageRange, IDosageRange } from "./DosageRange";

export interface IMedicationDosageResult {
  dailyDosage: Amount;
  dailyFrequency: number;
  dosage: DosageRange;
}

export interface CreateMedicationDosageResult {
  dailyDosage: Amount;
  dailyFrequency: number;
  dosage: IDosageRange;
}

export class MedicationDosageResult extends ValueObject<IMedicationDosageResult> {
  protected validate(props: Readonly<IMedicationDosageResult>): void {
    // Implemente the validation rule if needs...
  }

  static create(
    createProps: CreateMedicationDosageResult
  ): Result<MedicationDosageResult> {
    try {
      const dosageRangeRes = DosageRange.create(createProps.dosage);
      if (dosageRangeRes.isFailure) {
        return Result.fail(
          formatError(dosageRangeRes, MedicationDosageResult.name)
        );
      }
      return Result.ok(
        new MedicationDosageResult({
          dailyDosage: createProps.dailyDosage,
          dailyFrequency: createProps.dailyFrequency,
          dosage: dosageRangeRes.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
