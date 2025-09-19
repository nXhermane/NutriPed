import {
  AggregateID,
  DomainDateTime,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
} from "@/core/shared";

export enum MessageType {
  PHASE_TRANSITION_REQUEST = "PHASE_TRANSITION_REQUEST",
  PHASE_FAILURE_NOTIFICATION = "PHASE_FAILURE_NOTIFICATION",
  MISSING_VARIABLES_NOTIFICATION = "MISSING_VARIABLES_NOTIFICATION",
  USER_DECISION_REQUEST = "USER_DECISION_REQUEST",
  GENERAL_NOTIFICATION = "GENERAL_NOTIFICATION",
}
export enum DecisionType {
  PHASE_TRANSITION_CONFIRMATION = "PHASE_TRANSITION_CONFIRMATION",
  PHASE_RETRY_DECISION = "PHASE_RETRY_DECISION",
  VARIABLE_PROVISION = "VARIABLE_PROVISION",
  TREATMENT_ADJUSTMENT = "TREATMENT_ADJUSTMENT",
}
export interface IMessage extends EntityPropsBaseType {
  type: MessageType;
  content: string;
  timestamp: DomainDateTime;
  requiresResponse: boolean;
  decisionType?: DecisionType;
}
export interface CreateMessage {
  type: MessageType;
  content: string;
  timestamp?: string;
  requiresResponse: boolean;
  decisionType?: DecisionType;
}
export class Message extends Entity<IMessage> {
  getType(): MessageType {
    return this.props.type;
  }
  getContent(): string {
    return this.props.content;
  }
  getRequiresResponse() {
    return this.props.requiresResponse;
  }
  getDecisionType(): DecisionType | undefined {
    return this.props.decisionType;
  }
  getTimeStamp(): string {
    return this.props.timestamp.toString();
  }
  reponseReceived() {
    this.props.requiresResponse = false;
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.content).succeeded) {
      throw new EmptyStringError("The message content can't be empty.");
    }
    this._isValid = true;
  }
  static create(createProps: CreateMessage, id: AggregateID) {
    try {
      const timestampRes = DomainDateTime.create(createProps.timestamp);
      if (timestampRes.isFailure) {
        return Result.fail(formatError(timestampRes, Message.name));
      }
      return Result.ok(
        new Message({
          id,
          props: {
            content: createProps.content,
            requiresResponse: createProps.requiresResponse,
            type: createProps.type,
            decisionType: createProps.decisionType,
            timestamp: timestampRes.val,
          },
        })
      );
    } catch (e) {
      return handleError(e);
    }
  }
}
