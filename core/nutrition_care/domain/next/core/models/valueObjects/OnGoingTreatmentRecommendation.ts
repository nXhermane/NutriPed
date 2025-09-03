import { MEDICINE_CODES, RECOMMENDED_TREATMENT_TYPE } from "@/core/constants";
import {
  Duration,
  Frequency,
  IDuration,
  IFrequency,
  MilkType,
} from "@/core/nutrition_care/domain/modules";
import {
  AggregateID,
  formatError,
  Guard,
  handleError,
  InvalidReference,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";

export interface IOnGoingTreatmentRecommendation {
  id: AggregateID;
  type: RECOMMENDED_TREATMENT_TYPE;
  code: SystemCode<MilkType | MEDICINE_CODES>;
  duration: Duration;
  frequency: Frequency;
  adjustmentPercentage?: number;
}
export interface CreateOnGoingTreatmentRecommendation {
  id: AggregateID;
  type: RECOMMENDED_TREATMENT_TYPE;
  code: MilkType | MEDICINE_CODES;
  duration: IDuration;
  frequency: IFrequency;
  adjustmentPercentage?: number;
}
export class OnGoingTreatmentRecommendation extends ValueObject<IOnGoingTreatmentRecommendation> {
  getId(): AggregateID {
    return this.props.id;
  }
  getCode(): MilkType | MEDICINE_CODES {
    return this.props.code.unpack();
  }
  getDuration(): IDuration {
    return this.props.duration.unpack();
  }
  getFrequency(): IFrequency {
    return this.props.frequency.unpack();
  }
  getAdjustmentPercentage(): number | undefined {
    return this.props.adjustmentPercentage;
  }
  protected validate(props: Readonly<IOnGoingTreatmentRecommendation>): void {
    if (Guard.isEmpty(props.id).succeeded) {
      throw new InvalidReference(
        "The reference of recommended treatment can't be empty."
      );
    }
  }
  static create(
    createProps: CreateOnGoingTreatmentRecommendation
  ): Result<OnGoingTreatmentRecommendation> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const frequencyRes = Frequency.create(createProps.frequency);
      const durationRes = Duration.create(createProps.duration);
      const combinedRes = Result.combine([codeRes, frequencyRes, durationRes]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, OnGoingTreatmentRecommendation.name)
        );
      }
      const recommendation = new OnGoingTreatmentRecommendation({
        id: createProps.id,
        code: codeRes.val,
        type: createProps.type,
        duration: durationRes.val,
        frequency: frequencyRes.val,
        adjustmentPercentage: createProps.adjustmentPercentage,
      });
      return Result.ok(recommendation);
    } catch (e) {
      return handleError(e);
    }
  }
}
