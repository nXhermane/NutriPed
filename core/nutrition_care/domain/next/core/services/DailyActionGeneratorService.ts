import {
  DomainDateTime,
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import {
  OnGoingTreatment,
  DailyCareAction,
  OnGoingTreatmentRecommendation,
  CreateMedicalAction,
  CreateNutritionalAction,
  DailyCareActionType,
} from "../models";
import { IDailyActionGeneratorService } from "./interfaces";
import {
  INutritionalProductAdvisorService,
  IMedicationDosageCalculator,
} from "../../../modules/next";
import {
  MEDICINE_CODES,
  MilkType,
  RECOMMENDED_TREATMENT_TYPE,
} from "@/core/constants";

export class DailyActionGeneratorService
  implements IDailyActionGeneratorService
{
  constructor(
    private readonly idGenerator: GenerateUniqueId,
    private readonly medicineDosageService: IMedicationDosageCalculator,
    private readonly nutritionalProductService: INutritionalProductAdvisorService
  ) {}
  async generate(
    treatment: OnGoingTreatment,
    actionEffectiveDates: DomainDateTime[],
    context: Record<string, number>
  ): Promise<Result<DailyCareAction[]>> {
    try {
      const recommendation = treatment.getProps().recommendation;
      const isNutritionalAction =
        recommendation.getType() === RECOMMENDED_TREATMENT_TYPE.NUTRITIONAL;
      const actionRes = isNutritionalAction
        ? await this.generateNutritionalProductAction(recommendation, context)
        : await this.generateMedicineAction(recommendation, context);
      if (actionRes.isFailure) {
        return Result.fail(
          formatError(actionRes, DailyActionGeneratorService.name)
        );
      }
      const dailyActionResults = [];
      for (const effectiveDate of actionEffectiveDates) {
        const dailyActionRes = DailyCareAction.create(
          {
            action: actionRes.val,
            effectiveDate: effectiveDate.toString(),
            treatmentId: treatment.id,
            type: isNutritionalAction
              ? DailyCareActionType.NUTRITIONAL_ACTION
              : DailyCareActionType.MEDICAL_ACTION,
          },
          this.idGenerator.generate().toValue()
        );
        dailyActionResults.push(dailyActionRes);
      }
      const combinedRes = Result.combine(dailyActionResults);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, DailyActionGeneratorService.name)
        );
      }
      return Result.ok(dailyActionResults.map(res => res.val));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async generateMedicineAction(
    recommendation: OnGoingTreatmentRecommendation,
    context: Record<string, number>
  ): Promise<Result<CreateMedicalAction>> {
    try {
      if (recommendation.getType() !== RECOMMENDED_TREATMENT_TYPE.SYSTEMATIC) {
        return Result.fail(
          "The medicine action can't be generated because the reommendation type must be SYSTEMATIC for that."
        );
      }
      const medicineCode = recommendation.unpack()
        .code as SystemCode<MEDICINE_CODES>;
      const medicineDosageResult = await this.medicineDosageService.calculate(
        medicineCode,
        context as any
      );
      if (medicineDosageResult.isFailure) {
        return Result.fail(
          formatError(medicineDosageResult, DailyActionGeneratorService.name)
        );
      }
      const medicineDosage = medicineDosageResult.val.unpack();
      return Result.ok({
        dailyDosage: medicineDosage.dailyDosage,
        dailyFrequency: medicineDosage.dailyFrequency,
        dosage: medicineDosage.dosage.unpack(),
      });
    } catch (e) {
      return handleError(e);
    }
  }
  private async generateNutritionalProductAction(
    recommendation: OnGoingTreatmentRecommendation,
    context: Record<string, number>
  ): Promise<Result<CreateNutritionalAction>> {
    try {
      if (recommendation.getType() !== RECOMMENDED_TREATMENT_TYPE.NUTRITIONAL) {
        return Result.fail(
          "The nutritional action generation failed because the recommended treatment type must be NUTRITIONAL for that."
        );
      }
      const nutritionalProductCode = recommendation.unpack()
        .code as SystemCode<MilkType>;
      const nutritionalDosageResult =
        await this.nutritionalProductService.getDosage(
          nutritionalProductCode,
          context as any,
          recommendation.getAdjustmentPercentage()
        );
      if (nutritionalDosageResult.isFailure) {
        return Result.fail(
          formatError(nutritionalDosageResult, DailyActionGeneratorService.name)
        );
      }
      const nutritionalDosage = nutritionalDosageResult.val;
      return Result.ok({
        calcultedQuantity: nutritionalDosage.getCalculatedQuantity(),
        feedingFrequencies: nutritionalDosage.getFeedingFrequencies(),
        recommendedQuantity: nutritionalDosage.getRecommendedQuantity(),
        productType: nutritionalDosage.getProductType(),
      });
    } catch (e) {
      return handleError(e);
    }
  }
}
