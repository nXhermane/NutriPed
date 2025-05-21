import {
  AggregateID,
  AggregateRoot,
  ArgumentNotProvidedException,
  DateTime,
  DomainDate,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  IDateTime,
  Result,
} from "@shared";
import { CreateReminderTriggerProps, IReminderAction, IReminderTriggerProps, ReminderAction, ReminderTrigger } from "../valueObject";

import {
  ReminderCreatedEvent,
  ReminderDeletedEvent,
  ReminderUpdatedEvent,
} from "../../events";


export interface IReminder extends EntityPropsBaseType {
  title: string;
  message: string;
  trigger: ReminderTrigger;
  reminderCreatedAt: DateTime;
  isActive: boolean;
  actions: ReminderAction[];
}

export interface CreateReminderProps {
  title: string;
  message: string;
  trigger: CreateReminderTriggerProps;
  createdAt?: IDateTime;
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
      throw new ArgumentNotProvidedException("Le message ne peut pas être vide.");
    }

    this._isValid = true;
  }

  public getTrigger(): IReminderTriggerProps {
    return this.props.trigger.unpack();
  }

  public getCreatedAt(): IDateTime {
    return this.props.reminderCreatedAt.unpack();
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

  public updateTitle(newTitle: string): void {
    this.props.title = newTitle;
    this.validate();
  }

  public updateMessage(newMessage: string): void {
    this.props.message = newMessage;
    this.validate();
  }

  public updateTrigger(trigger: ReminderTrigger): void {
    this.props.trigger = trigger;
    this.validate();
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

  public markAsTriggered(): void {
    this.deactivate();
  }

  static create(props: CreateReminderProps, id: AggregateID): Result<Reminder> {
    try {
      const { title, message, trigger, createdAt, isActive, actions } = props;

      const createdAtDate = createdAt
        ? new DateTime(createdAt)
        : DateTime.fromDate(new Date());

      const triggerResult = ReminderTrigger.create(trigger);
      const actionsResults = actions.map((a) => ReminderAction.create(a));

      const combinedResult = Result.combine([triggerResult, ...actionsResults]);
      if (combinedResult.isFailure) {
        return Result.fail(formatError(combinedResult, Reminder.name));
      }

      const reminder = new Reminder({
        id,
        props: {
          title,
          message,
          trigger: triggerResult.val,
          reminderCreatedAt: createdAtDate,
          isActive,
          actions: actionsResults.map((r) => r.val),
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
        trigger: this.props.trigger.serialize(),
        actions: this.getActions(),
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
        trigger: this.props.trigger.serialize(),
        actions: this.getActions(),
      })
    );
  }

  override delete(): void {
    this.addDomainEvent(
      new ReminderDeletedEvent({
        id: this.id,
        isActive: this.getIsActive(),
      })
    );
    super.delete();
  }
}
