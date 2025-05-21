import {
  AggregateID,
  AggregateRoot,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  DateTime,
  DomainDate,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  IDateTime,
  Result,
  Time,
} from "@shared";
import { IReminderAction, ReminderAction } from "../valueObject";
import { ReminderRepeat } from "../constants";
import {
  ReminderCreatedEvent,
  ReminderDeletedEvent,
  ReminderUpdatedEvent,
} from "../../events";

export interface IReminder extends EntityPropsBaseType {
  title: string;
  message: string;
  scheduledTime: DateTime;
  reminderCreatedAt: DateTime;
  repeat: ReminderRepeat;
  isActive: boolean;
  actions: ReminderAction[];
}

export interface CreateReminderProps {
  title: string;
  message: string;
  scheduledTime: IDateTime;
  createdAt?: IDateTime;
  repeat: ReminderRepeat;
  isActive: boolean;
  actions: IReminderAction[];
}

export class Reminder extends AggregateRoot<IReminder> {
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.title).succeeded) {
      throw new ArgumentNotProvidedException("Le titre ne peut pas être vide.");
    }
    if (Guard.isEmpty(this.props.message).succeeded) {
      throw new ArgumentNotProvidedException(
        "Le message ne peut pas être vide."
      );
    }
    if (this.props.scheduledTime.toDate() < new Date()) {
      throw new ArgumentOutOfRangeException(
        "La date de rappel doit être dans le futur."
      );
    }
    this._isValid = true;
  }
  public getScheduledTime(): IDateTime {
    return this.props.scheduledTime.unpack();
  }
  public getCreatedAt(): IDateTime {
    return this.props.reminderCreatedAt.unpack();
  }
  public getRepeat(): ReminderRepeat {
    return this.props.repeat;
  }
  public getActions(): IReminderAction[] {
    return this.props.actions.map((action) => action.unpack());
  }
  public getTitle(): string {
    return this.props.title;
  }
  public getMessage(): string {
    return this.props.message;
  }
  public getIsActive(): boolean {
    return this.props.isActive;
  }
  public activate(): void {
    this.props.isActive = true;
  }

  public deactivate(): void {
    this.props.isActive = false;
  }

  public reschedule(newTime: DateTime): void {
    if (newTime.toDate() < new Date()) {
      throw new ArgumentOutOfRangeException(
        "La nouvelle date doit être dans le futur."
      );
    }
    this.props.scheduledTime = newTime as DateTime;
  }

  public addAction(action: IReminderAction): void {
    this.props.actions.push(new ReminderAction(action));
  }

  public removeAction(action: ReminderAction): void {
    this.props.actions = this.props.actions.filter((a) => a !== action);
  }
  public changeActions(actions: ReminderAction[]): void {
    this.props.actions = actions;
    this.validate();
  }
  public updateTitle(newTitle: string): void {
    this.props.title = newTitle;
    this.validate();
  }

  public updateMessage(newMessage: string): void {
    this.props.message = newMessage;
    this.validate();
  }

  public updateRepeat(newRepeat: ReminderRepeat): void {
    this.props.repeat = newRepeat;
    this.validate();
  }

  public markAsTriggered(): void {
    this.deactivate();
  }

  static create(props: CreateReminderProps, id: AggregateID): Result<Reminder> {
    try {
      const {
        title,
        message,
        scheduledTime,
        createdAt,
        repeat,
        isActive,
        actions,
      } = props;
      const createdAtDate = props.createdAt
        ? new DateTime(props.createdAt)
        : DateTime.fromDate(new Date());
      const scheduledTimeDate = DateTime.create(props.scheduledTime);
      const actionsResults = actions.map((action) =>
        ReminderAction.create(action)
      );
      const combinedResult = Result.combine([
        ...actionsResults,
        scheduledTimeDate,
      ]);
      if (combinedResult.isFailure) {
        return Result.fail(formatError(combinedResult, Reminder.name));
      }
      const reminder = new Reminder({
        id,
        props: {
          title,
          message,
          scheduledTime: scheduledTimeDate.val,
          reminderCreatedAt: createdAtDate,
          repeat,
          isActive,
          actions: actionsResults.map((action) => action.val),
        },
      });
      return Result.ok(reminder);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  override created(): void {
    this.addDomainEvent(
      new ReminderCreatedEvent({
        id: this.id,
        title: this.getTitle(),
        message: this.getMessage(),
        isActive: this.getIsActive(),
        scheduledTime: this.getScheduledTime(),
        actions: this.getActions(),
        repeat: this.getRepeat(),
      })
    );
  }
  override updated(): void {
    this.addDomainEvent(
      new ReminderUpdatedEvent({
        id: this.id,
        title: this.getTitle(),
        message: this.getMessage(),
        isActive: this.getIsActive(),
        scheduledTime: this.getScheduledTime(),
        actions: this.getActions(),
        repeat: this.getRepeat(),
      })
    );
  }
  override delete(): void {
    this.addDomainEvent(
      new ReminderDeletedEvent({
        id: this.id,
      })
    );
    super.delete();
  }
}
