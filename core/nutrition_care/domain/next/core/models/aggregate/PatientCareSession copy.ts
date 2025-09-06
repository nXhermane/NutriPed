import { CarePhase, DailyCareRecord } from "./../entities";
import {
  AggregateID,
  AggregateRoot,
  ArgumentOutOfRangeException,
  CreateEntityProps,
  DomainDateTime,
  EntityPropsBaseType,
  handleError,
  InvalidObject,
  Result,
} from "@/core/shared";

export enum PatientCareSessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  WAITING_FOR_USER_RESPONSE = "WAITING_FOR_USER_RESPONSE",
}

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

export interface Message {
  id: AggregateID;
  type: MessageType;
  content: string;
  timestamp: DomainDateTime;
  requiresResponse: boolean;
  decisionType?: DecisionType;
}

export interface UserResponse {
  messageId: AggregateID;
  response: string;
  timestamp: DomainDateTime;
  decisionData?: Record<string, any>;
}

export interface IPatientCareSession extends EntityPropsBaseType {
  patientId: AggregateID;
  status: PatientCareSessionStatus;
  startDate: DomainDateTime;
  endDate: DomainDateTime | null;
  currentPhase: CarePhase | null;
  currentDailyRecord: DailyCareRecord | null;
  phaseHistory: CarePhase[];
  dailyRecords: DailyCareRecord[];
  // Communication system
  inbox: Message[];
  responses: UserResponse[];
}
export interface CreatePatientCareSession {
  patientId: AggregateID;
}
export class PatientCareSession extends AggregateRoot<IPatientCareSession> {
  constructor(createEntityProps: CreateEntityProps<IPatientCareSession>) {
    super(createEntityProps);
  }

  getPatientId(): AggregateID {
    return this.props.patientId;
  }
  getStatus(): PatientCareSessionStatus {
    return this.props.status;
  }
  getStartDate(): string {
    return this.props.startDate.toString();
  }

  getEndDate(): string | null {
    return this.props.endDate ? this.props.endDate.toString() : null;
  }

  getCurrentPhase(): CarePhase | null {
    return this.props.currentPhase;
  }

  getCurrentDailyRecord(): DailyCareRecord | null {
    return this.props.currentDailyRecord;
  }

  getPhaseHistory(): CarePhase[] {
    return this.props.phaseHistory;
  }

  getDailyRecords(): DailyCareRecord[] {
    return this.props.dailyRecords;
  }

  // Communication system getters
  getInbox(): Message[] {
    return this.props.inbox;
  }

  getResponses(): UserResponse[] {
    return this.props.responses;
  }

  hasPendingMessages(): boolean {
    return this.props.inbox.some(msg => msg.requiresResponse);
  }

  getPendingMessages(): Message[] {
    return this.props.inbox.filter(msg => msg.requiresResponse);
  }

  // Communication system methods
  sendMessage(
    type: MessageType,
    content: string,
    requiresResponse: boolean = false,
    decisionType?: DecisionType,
    messageId?: AggregateID
  ): Message {
    const message: Message = {
      id: messageId || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: DomainDateTime.now(),
      requiresResponse,
      decisionType,
    };

    this.props.inbox.push(message);

    // If message requires response, change status to waiting
    if (requiresResponse && this.props.status === PatientCareSessionStatus.IN_PROGRESS) {
      this.props.status = PatientCareSessionStatus.WAITING_FOR_USER_RESPONSE;
    }

    this.validate();
    return message;
  }

  receiveUserResponse(messageId: AggregateID, response: string, decisionData?: Record<string, any>): boolean {
    const messageIndex = this.props.inbox.findIndex(msg => msg.id === messageId);
    if (messageIndex === -1) {
      return false; // Message not found
    }

    const message = this.props.inbox[messageIndex];
    if (!message.requiresResponse) {
      return false; // Message doesn't require response
    }

    // Add response
    const userResponse: UserResponse = {
      messageId,
      response,
      timestamp: DomainDateTime.now(),
      decisionData,
    };

    this.props.responses.push(userResponse);

    // Mark message as responded (remove from pending)
    message.requiresResponse = false;

    // If no more pending messages, change status back to in progress
    if (!this.hasPendingMessages() && this.props.status === PatientCareSessionStatus.WAITING_FOR_USER_RESPONSE) {
      this.props.status = PatientCareSessionStatus.IN_PROGRESS;
    }

    this.validate();
    return true;
  }

  clearInbox(): void {
    this.props.inbox = [];
    if (this.props.status === PatientCareSessionStatus.WAITING_FOR_USER_RESPONSE) {
      this.props.status = PatientCareSessionStatus.IN_PROGRESS;
    }
    this.validate();
  }

  // Helper methods for common message types
  notifyPhaseTransition(nextPhaseCode: string): Message {
    return this.sendMessage(
      MessageType.PHASE_TRANSITION_REQUEST,
      `La phase de soin actuelle est terminée. Voulez-vous passer à la phase "${nextPhaseCode}" ?`,
      true,
      DecisionType.PHASE_TRANSITION_CONFIRMATION
    );
  }

  notifyPhaseFailure(reason: string): Message {
    return this.sendMessage(
      MessageType.PHASE_FAILURE_NOTIFICATION,
      `La phase de soin a échoué : ${reason}. Voulez-vous réessayer ou ajuster le traitement ?`,
      true,
      DecisionType.PHASE_RETRY_DECISION
    );
  }

  notifyMissingVariables(missingVars: string[]): Message {
    return this.sendMessage(
      MessageType.MISSING_VARIABLES_NOTIFICATION,
      `Variables manquantes pour continuer : ${missingVars.join(', ')}. Veuillez les fournir.`,
      true,
      DecisionType.VARIABLE_PROVISION
    );
  }

  requestUserDecision(question: string, decisionType: DecisionType): Message {
    return this.sendMessage(
      MessageType.USER_DECISION_REQUEST,
      question,
      true,
      decisionType
    );
  }

  private getNextDailyRecordDate(): DomainDateTime {
    if (this.props.dailyRecords.length === 0) {
      return this.props.startDate;
    }

    // Trouve le dernier record et ajoute un jour
    const lastRecord = this.props.dailyRecords
      .sort((a, b) => {
        const aDate = a.getProps().date;
        const bDate = b.getProps().date;
        if (aDate.isAfter(bDate)) return 1;
        if (aDate.isSameDay(bDate)) return 0;
        return -1;
      })
      .pop();
    const nextDate = lastRecord?.getProps().date!;
    return nextDate.addDays(1);
  }
  transitionToNewPhase(newPhase: CarePhase): void {
    if (this.props.currentPhase) {
      this.props.phaseHistory.push(this.props.currentPhase);
    }
    this.props.currentPhase = newPhase;
    this.validate();
  }
  completeSession(): void {
    this.props.status = PatientCareSessionStatus.COMPLETED;
    this.props.endDate = DomainDateTime.now();

    if (this.props.currentPhase) {
      this.props.phaseHistory.push(this.props.currentPhase);
      this.props.currentPhase = null;
    }

    this.props.currentDailyRecord = null;
    this.validate();
  }
  updateCurrentDailyRecord(record: DailyCareRecord): void {
    const today = DomainDateTime.now();
    const recordDate = DomainDateTime.create(record.getDate()).val;
    if (
      this.props.currentDailyRecord !== null &&
      !recordDate.isSameDay(today)
    ) {
      this.props.dailyRecords.push(this.props.currentDailyRecord);
      this.props.currentDailyRecord = null;
    }
    this.props.currentDailyRecord = record;
    this.validate();
  }

  public validate(): void {
    this._isValid = false;
    if (
      this.props.endDate &&
      this.props.startDate.isAfter(this.props.endDate)
    ) {
      throw new ArgumentOutOfRangeException(
        "Start date cannot be after end date"
      );
    }

    if (
      this.props.status === PatientCareSessionStatus.COMPLETED &&
      !this.props.endDate
    ) {
      throw new InvalidObject(
        "End date must be provided when session is completed"
      );
    }

    if (
      this.props.status === PatientCareSessionStatus.IN_PROGRESS &&
      this.props.endDate
    ) {
      throw new InvalidObject(
        "End date cannot be provided when session is in progress"
      );
    }
    this._isValid = true;
  }

  static create(
    createProps: CreatePatientCareSession,
    id: AggregateID
  ): Result<PatientCareSession> {
    try {
      return Result.ok(
        new PatientCareSession({
          id,
          props: {
            patientId: createProps.patientId,
            status: PatientCareSessionStatus.IN_PROGRESS,
            startDate: DomainDateTime.now(),
            endDate: null,
            currentPhase: null,
            currentDailyRecord: null,
            dailyRecords: [],
            phaseHistory: [],
            inbox: [],
            responses: [],
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
