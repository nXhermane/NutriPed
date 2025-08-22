import { MEDICINE_CODES, RECOMMENDED_TREATMENT_TYPE } from "@/core/constants";
import {
  AggregateID,
  CreateCriterion,
  Criterion,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  ICriterion,
  Result,
  SystemCode,
} from "@/core/shared";
import { MilkType } from "../../../milk";
import {
  CreateTreatmentTrigger,
  ITreatmentDuration,
  ITreatmentTrigger,
  TreatmentDuration,
  TreatmentTrigger,
} from "../valueObjects";

export interface IRecommendedTreatment extends EntityPropsBaseType {
  code: SystemCode;
  applicabilyCondition: Criterion;
  type: RECOMMENDED_TREATMENT_TYPE;
  treatmentCode: SystemCode<MilkType | MEDICINE_CODES>;
  duration: TreatmentDuration;
  triggers: {
    onStart: TreatmentTrigger[];
    onEnd: TreatmentTrigger[];
  };
  ajustmentPercentage?: number;
}
export interface CreateRecommededTreatment {
  code: string;
  applicabilyCondition: CreateCriterion;
  type: RECOMMENDED_TREATMENT_TYPE;
  treatmentCode: MilkType | MEDICINE_CODES;
  duration: ITreatmentDuration;
  triggers: {
    onStart: CreateTreatmentTrigger[];
    onEnd: CreateTreatmentTrigger[];
  };
  ajustmentPercentage?: number;
}
export class RecommendedTreatment extends Entity<IRecommendedTreatment> {
  getCode(): string {
    return this.props.code.unpack();
  }
  getApplicabilyCondition(): ICriterion {
    return this.props.applicabilyCondition.unpack();
  }
  getType(): RECOMMENDED_TREATMENT_TYPE {
    return this.props.type;
  }
  getTreatmentCode(): MilkType | MEDICINE_CODES {
    return this.props.treatmentCode.unpack();
  }
  getDuration(): ITreatmentDuration {
    return this.props.duration.unpack();
  }
  getStartedTriggers(): ITreatmentTrigger[] {
    return this.props.triggers.onStart.map(trigger => trigger.unpack());
  }
  getEndedTrigger(): ITreatmentTrigger[] {
    return this.props.triggers.onEnd.map(trigger => trigger.unpack());
  }
  getAjustmentPercentage(): number | undefined {
    return this.props?.ajustmentPercentage;
  }
  // BETA: implementer les updaters plustart...
  public validate(): void {
    this._isValid = false;
    // Implement the validation rule here...
    this._isValid = true;
  }
  static create(
    createProps: CreateRecommededTreatment,
    id: AggregateID
  ): Result<RecommendedTreatment> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const treatmentCodeRes = SystemCode.create(createProps.treatmentCode);
      const criterionRes = Criterion.create(createProps.applicabilyCondition);
      const treatmentDurationRes = TreatmentDuration.create(
        createProps.duration
      );
      const onStartTriggersRes = createProps.triggers.onStart.map(trigger =>
        TreatmentTrigger.create(trigger)
      );
      const onEndTriggersRes = createProps.triggers.onEnd.map(trigger =>
        TreatmentTrigger.create(trigger)
      );
      const combinedRes = Result.combine([
        codeRes,
        treatmentCodeRes,
        criterionRes,
        treatmentDurationRes,
        ...onStartTriggersRes,
        ...onEndTriggersRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, RecommendedTreatment.name));
      }
      const recommendedTreatment = new RecommendedTreatment({
        id,
        props: {
          applicabilyCondition: criterionRes.val,
          code: codeRes.val,
          treatmentCode: treatmentCodeRes.val,
          duration: treatmentDurationRes.val,
          type: createProps.type,
          triggers: {
            onStart: onStartTriggersRes.map(trigger => trigger.val),
            onEnd: onEndTriggersRes.map(trigger => trigger.val),
          },
          ajustmentPercentage: createProps?.ajustmentPercentage,
        },
      });
      return Result.ok(recommendedTreatment);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
