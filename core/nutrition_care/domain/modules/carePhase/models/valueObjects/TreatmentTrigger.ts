import { TREATMENT_TRIGGER_ACTION } from "@/core/constants";
import {
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";

export interface ITreatmentTrigger {
  action: TREATMENT_TRIGGER_ACTION;
  targetTreatment: SystemCode;
}
export interface CreateTreatmentTrigger {
  action: TREATMENT_TRIGGER_ACTION;
  targetTreatment: string;
}

export class TreatmentTrigger extends ValueObject<ITreatmentTrigger> {
  getCode(): string {
    return this.props.targetTreatment.unpack();
  }
  getAction(): TREATMENT_TRIGGER_ACTION {
    return this.props.action;
  }
  protected validate(props: Readonly<ITreatmentTrigger>): void {}
  static create(createProps: CreateTreatmentTrigger): Result<TreatmentTrigger> {
    try {
      const codeRes = SystemCode.create(createProps.targetTreatment);
      if (codeRes.isFailure) {
        return Result.fail(formatError(codeRes, TreatmentTrigger.name));
      }
      return Result.ok(
        new TreatmentTrigger({
          action: createProps.action,
          targetTreatment: codeRes.val,
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
