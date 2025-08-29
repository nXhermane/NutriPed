import { TREATMENT_PLAN_IDS } from "@/core/constants";
import {
  AggregateID,
  ArgumentInvalidException,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import { ValueOf } from "@/utils";

export enum OnGoingTreatmentStatus {
  ACTIVE = "active",
  STOPPED = "stopped",
  COMPLETED = "completed",
}
export interface IOnGoingTreatment extends EntityPropsBaseType {
  code: SystemCode<ValueOf<typeof TREATMENT_PLAN_IDS>>;
  startDate: DomainDateTime;
  endDate: DomainDateTime | null;
  status: OnGoingTreatmentStatus;
  nextActionDate: DomainDateTime | null;
}

export interface CreateOnGoindTreatment {
  code: ValueOf<typeof TREATMENT_PLAN_IDS>;
  startDate?: string;
  endDate: string | null;
  status: OnGoingTreatmentStatus;
  nextActionDate: string | null;
}

export class OnGoingTreatment extends Entity<IOnGoingTreatment> {
  getCode(): ValueOf<typeof TREATMENT_PLAN_IDS> {
    return this.props.code.unpack();
  }
  getStartDate(): string {
    return this.props.startDate.toString();
  }
  getEndDate(): string | null {
    return this.props.endDate ? this.props.endDate.toString() : null;
  }
  getNextActionDate(): string | null {
    return this.props.nextActionDate
      ? this.props.nextActionDate.toString()
      : null;
  }
  getStatus(): OnGoingTreatmentStatus {
    return this.props.status;
  }
  stopTreatment(): void {
    this.props.status = OnGoingTreatmentStatus.STOPPED;
    this.validate();
  }
  activeTreatment(): void {
    this.props.status = OnGoingTreatmentStatus.ACTIVE;
    this.validate();
  }
  completedTreatment(): void {
    this.props.status = OnGoingTreatmentStatus.COMPLETED;
    this.props.endDate = DomainDateTime.now();
    this.validate();
  }
  changeEndDate(endDate: DomainDateTime | null) {
    this.props.endDate = endDate;
    this.validate();
  }
  changeNextActionDate(nextActionDate: DomainDateTime | null) {
    this.props.nextActionDate = nextActionDate;
    this.validate();
  }

  public validate(): void {
    this._isValid = false;
    if (
      Guard.isEmpty(this.props.endDate).succeeded &&
      Guard.isEmpty(this.props.nextActionDate).succeeded
    ) {
      throw new ArgumentInvalidException(
        "If the end date is empty, the next action date must be provided"
      );
    }
    if (
      this.props.nextActionDate &&
      this.props.nextActionDate.isBefore(this.props.startDate)
    ) {
      throw new ArgumentInvalidException(
        "The next action date cannot be before the start date"
      );
    }
    if (
      this.props.status === OnGoingTreatmentStatus.COMPLETED &&
      Guard.isEmpty(this.props.endDate).succeeded
    ) {
      throw new ArgumentInvalidException(
        "The end date must be provided when the status is completed"
      );
    }
    this._isValid = true;
  }
  static create(
    createProps: CreateOnGoindTreatment,
    id: AggregateID
  ): Result<OnGoingTreatment> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const startDateRes = DomainDateTime.create(createProps.startDate);
      const endDateRes = createProps.endDate
        ? DomainDateTime.create(createProps.endDate)
        : Result.ok(null);
      const nextActionDateRes = createProps.nextActionDate
        ? DomainDateTime.create(createProps.nextActionDate)
        : Result.ok(null);
      const combinedRes = Result.combine([
        codeRes,
        startDateRes,
        endDateRes,
        nextActionDateRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, OnGoingTreatment.name));
      }
      return Result.ok(
        new OnGoingTreatment({
          id,
          props: {
            code: codeRes.val,
            startDate: startDateRes.val,
            endDate: endDateRes.val,
            nextActionDate: nextActionDateRes.val,
            status: createProps.status,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
