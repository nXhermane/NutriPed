import {
  AggregateID,
  ArgumentInvalidException,
  DomainDateTime,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  InvalidReference,
  Result,
} from "@/core/shared";
import {
  CreateMedicalAction,
  CreateNutritionalAction,
  IMedicalAction,
  INutritionalAction,
  MedicalAction,
  NutritionalAction,
} from "../valueObjects";

export enum DailyCareActionStatus {
  COMPLETED = "completed",
  NOT_COMPLETED = "not_completed",
  IN_WAITING = "in_waiting",
  IN_PROGRESS = "in_progress",
}
export enum DailyCareActionType {
  NUTRITIONAL_ACTION = "nutritional_action",
  MEDICAL_ACTION = "medical_action",
}

export interface IDailyCareAction extends EntityPropsBaseType {
  treatmentId: AggregateID;
  status: DailyCareActionStatus;
  type: DailyCareActionType;
  action: NutritionalAction | MedicalAction;
  effectiveDate: DomainDateTime; // Ceci est exactement la meme date dans le nextActionDate de onGoingTreatment 
}
export interface CreateDailyCareAction {
  treatmentId: AggregateID;
  status?: DailyCareActionStatus;
  type: DailyCareActionType;
  action: INutritionalAction | IMedicalAction;
  effectiveDate: string;
}

export class DailyCareAction extends Entity<IDailyCareAction> {
  getTreatmentId(): AggregateID {
    return this.props.treatmentId;
  }
  getStatus(): DailyCareActionStatus {
    return this.props.status;
  }
  getType(): DailyCareActionType {
    return this.props.type;
  }
  getAction(): INutritionalAction | IMedicalAction {
    return this.props.action.unpack();
  }
  getEffectiveDate(): string {
    return this.props.effectiveDate.toString();
  }
  completed(): void {
    if (this.checkIsEffective()) {
      this.props.status = DailyCareActionStatus.COMPLETED;
    }
  }
  isCompleted(): boolean {
    return this.props.status === DailyCareActionStatus.COMPLETED;
  }
  notCompleted(): void {
    if (this.checkIsEffective()) {
      this.props.status = DailyCareActionStatus.NOT_COMPLETED;
    }
  }
  isNotCompleted(): boolean {
    return this.props.status === DailyCareActionStatus.NOT_COMPLETED;
  }
  inWaiting(): void {
    this.props.status = DailyCareActionStatus.IN_WAITING;
  }
  isWaiting(): boolean {
    return this.props.status === DailyCareActionStatus.IN_WAITING;
  }
  inProgress(): void {
    if (this.checkIsEffective()) {
      this.props.status = DailyCareActionStatus.IN_PROGRESS;
    }
  }
  isInProgress(): boolean {
    return this.props.status === DailyCareActionStatus.IN_PROGRESS;
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.treatmentId).succeeded) {
      throw new InvalidReference(
        "The daily care action can't not have any treatment"
      );
    }
    if (
      (this.props.action instanceof NutritionalAction &&
        this.props.type === DailyCareActionType.MEDICAL_ACTION) ||
      (this.props.action instanceof MedicalAction &&
        this.props.type === DailyCareActionType.NUTRITIONAL_ACTION)
    ) {
      throw new ArgumentInvalidException(
        "Please when action is provided, provid a right action type."
      );
    }
    this._isValid = true;
  }
  checkIsEffective() {
    const dateNow = DomainDateTime.now();
    return (
      this.props.effectiveDate.isAfter(dateNow) ||
      this.props.effectiveDate.isSameDateTime(dateNow)
    );
  }
  static create(
    createProps: CreateDailyCareAction,
    id: AggregateID
  ): Result<DailyCareAction> {
    try {
      const actionRes =
        createProps.type === DailyCareActionType.NUTRITIONAL_ACTION
          ? NutritionalAction.create(
              createProps.action as unknown as CreateNutritionalAction
            )
          : MedicalAction.create(
              createProps.action as unknown as CreateMedicalAction
            );
      const effectiveDateRes = DomainDateTime.create(createProps.effectiveDate);
      const combinedRes = Result.combine([actionRes, effectiveDateRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, DailyCareAction.name));
      }

      return Result.ok(
        new DailyCareAction({
          id,
          props: {
            treatmentId: createProps.treatmentId,
            status: createProps.status || DailyCareActionStatus.IN_WAITING,
            type: createProps.type,
            action: actionRes.val,
            effectiveDate: effectiveDateRes.val,
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
