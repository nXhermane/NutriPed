import {
  AggregateID,
  ArgumentNotProvidedException,
  EmptyStringError,
  Guard,
  handleError,
  Result,
  ValueObject,
} from "@shared";

export enum ReminderActionType {
  WEIGHT_IN,
  MEDICATION,
  APPOINTMENT,
  CUSTOM,
}
export interface IReminderAction {
  type: ReminderActionType;
  description: string;
  payload: {
    patientId: AggregateID;
    [k: string]: any;
  };
}

export class ReminderAction extends ValueObject<IReminderAction> {
  protected validate(props: Readonly<IReminderAction>): void {
    if (Guard.isEmpty(props.payload).succeeded) {
      throw new ArgumentNotProvidedException(
        "The Reminder action payload can't be empty."
      );
    }
    if (Guard.isEmpty(props.description).succeeded) {
      throw new EmptyStringError(
        "You must provide a valid description of reminder action."
      );
    }
  }

  static create(props: IReminderAction): Result<ReminderAction> {
    try {
      return Result.ok(new ReminderAction(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
