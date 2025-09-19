import { TREATMENT_PLAN_IDS } from "@/core/constants";
import {
  ArgumentNotProvidedException,
  CreateCriterion,
  Criterion,
  formatError,
  Guard,
  handleError,
  ICriterion,
  Result,
  SystemCode,
  ValueObject,
} from "@/core/shared";
import { ValueOf } from "@/utils";

export interface IFollowUpAction {
  applicabilities: Criterion[];
  treatmentToApply: SystemCode<ValueOf<typeof TREATMENT_PLAN_IDS>>[];
}

export interface CreateFollowUpAction {
  applicabilities: CreateCriterion[];
  treatmentToApply: ValueOf<typeof TREATMENT_PLAN_IDS>[];
}

export class FollowUpAction extends ValueObject<IFollowUpAction> {
  getCriterions(): ICriterion[] {
    return this.props.applicabilities.map(criterion => criterion.unpack());
  }
  getTreatmentToApply(): ValueOf<typeof TREATMENT_PLAN_IDS>[] {
    return this.props.treatmentToApply.map(treatmentCode =>
      treatmentCode.unpack()
    );
  }
  protected validate(props: Readonly<IFollowUpAction>): void {
    if (Guard.isEmpty(props.applicabilities).succeeded) {
      throw new ArgumentNotProvidedException(
        "The applicabilities criterions must be provided for followUpAction"
      );
    }
    if (Guard.isEmpty(props.treatmentToApply).succeeded) {
      throw new ArgumentNotProvidedException(
        "The treatment to apply must be provided for followUpAction"
      );
    }
  }

  static create(createProps: CreateFollowUpAction): Result<FollowUpAction> {
    try {
      const criterionsRes = createProps.applicabilities.map(criterion =>
        Criterion.create(criterion)
      );
      const treatmentCodeRes = createProps.treatmentToApply.map(code =>
        SystemCode.create(code)
      );
      const combinedRes = Result.combine([
        ...criterionsRes,
        ...treatmentCodeRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, FollowUpAction.name));
      }
      return Result.ok(
        new FollowUpAction({
          applicabilities: criterionsRes.map(criterion => criterion.val),
          treatmentToApply: treatmentCodeRes.map(code => code.val),
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
