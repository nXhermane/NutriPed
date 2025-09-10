import { NextNutritionCare } from "@/core/nutrition_care/domain/modules";
import { formatError, handleError, Result, ValueObject } from "@/core/shared";

export interface IMedicalAction {
  dailyDosage: NextNutritionCare.Amount;
  dailyFrequency: number;
  dosage: NextNutritionCare.DosageRange;
}

export interface CreateMedicalAction {
  dailyDosage: NextNutritionCare.Amount;
  dailyFrequency: number;
  dosage: NextNutritionCare.IDosageRange;
}

export class MedicalAction extends ValueObject<IMedicalAction> {
  getDailyDosage(): NextNutritionCare.Amount {
    return this.props.dailyDosage;
  }
  getDailyFrequency(): number {
    return this.props.dailyFrequency;
  }
  getDosage(): NextNutritionCare.IDosageRange {
    return this.props.dosage.unpack();
  }
  protected validate(props: Readonly<IMedicalAction>): void {
    // Implement medical action if needed ...
  }
  static create(createProps: CreateMedicalAction): Result<MedicalAction> {
    try {
      const dosageRes = NextNutritionCare.DosageRange.create(
        createProps.dosage
      );
      if (dosageRes.isFailure) {
        return Result.fail(formatError(dosageRes, MedicalAction.name));
      }
      return Result.ok(
        new MedicalAction({
          dailyDosage: createProps.dailyDosage,
          dailyFrequency: createProps.dailyFrequency,
          dosage: dosageRes.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
