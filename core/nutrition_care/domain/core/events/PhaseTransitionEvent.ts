import {
  DomainEvent,
  AggregateID,
  Result,
  handleError,
} from "@shared";

export interface IPhaseTransitionEvent {
  sessionId: AggregateID;
  fromPhaseId: AggregateID;
  toPhaseId: AggregateID;
  transitionDate: Date;
  reason: string;
  performedBy: string;
  patientData: { [key: string]: any };
  validationResults: any[];
}

export class PhaseTransitionEvent extends DomainEvent<IPhaseTransitionEvent> {
  constructor(props: IPhaseTransitionEvent) {
    super(props, "PhaseTransitionEvent");
  }

  get sessionId(): AggregateID {
    return this.props.sessionId;
  }

  get fromPhaseId(): AggregateID {
    return this.props.fromPhaseId;
  }

  get toPhaseId(): AggregateID {
    return this.props.toPhaseId;
  }

  get transitionDate(): Date {
    return this.props.transitionDate;
  }

  get reason(): string {
    return this.props.reason;
  }

  get performedBy(): string {
    return this.props.performedBy;
  }

  static create(props: IPhaseTransitionEvent): Result<PhaseTransitionEvent> {
    try {
      return Result.ok(new PhaseTransitionEvent(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
