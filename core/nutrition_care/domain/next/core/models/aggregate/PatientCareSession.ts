import { UserResponse } from "../valueObjects";
import {
  CarePhase,
  DailyCareRecord,
  DecisionType,
  Message,
  MessageType,
} from "./../entities";
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
    return this.props.inbox.some(msg => msg.getRequiresResponse());
  }

  getPendingMessages(): Message[] {
    return this.props.inbox.filter(msg => msg.getRequiresResponse());
  }

  // Communication system methods
  sendMessage(message: Message): Message {
    this.props.inbox.push(message);

    // If message requires response, change status to waiting
    if (
      message.getRequiresResponse() &&
      this.props.status === PatientCareSessionStatus.IN_PROGRESS
    ) {
      this.props.status = PatientCareSessionStatus.WAITING_FOR_USER_RESPONSE;
    }

    this.validate();
    return message;
  }

  receiveUserResponse(response: UserResponse): boolean {
    const messageIndex = this.props.inbox.findIndex(
      msg => msg.id === response.getMessageId()
    );
    if (messageIndex === -1) {
      return false; // Message not found
    }

    const message = this.props.inbox[messageIndex];
    if (!message.getRequiresResponse()) {
      return false; // Message doesn't require response
    }

    this.props.responses.push(response);

    // Mark message as responded (remove from pending)
    message.reponseReceived();
    // If no more pending messages, change status back to in progress
    if (
      !this.hasPendingMessages() &&
      this.props.status === PatientCareSessionStatus.WAITING_FOR_USER_RESPONSE
    ) {
      this.props.status = PatientCareSessionStatus.IN_PROGRESS;
    }

    this.validate();
    return true;
  }

  clearInbox(): void {
    this.props.inbox = [];
    if (
      this.props.status === PatientCareSessionStatus.WAITING_FOR_USER_RESPONSE
    ) {
      this.props.status = PatientCareSessionStatus.IN_PROGRESS;
    }
    this.validate();
  }

  // Helper methods for common message types
  notifyPhaseTransition(
    nextPhaseCode: string,
    notifId: AggregateID
  ): Result<Message> {
    const messageRes = Message.create(
      {
        type: MessageType.PHASE_TRANSITION_REQUEST,
        decisionType: DecisionType.PHASE_TRANSITION_CONFIRMATION,
        content: `La phase de soin actuelle est terminée. Voulez-vous passer à la phase "${nextPhaseCode}" ?`,
        requiresResponse: true,
      },
      notifId
    );
    if (messageRes.isFailure) {
      return messageRes;
    }
    this.sendMessage(messageRes.val);
    return messageRes;
  }

  notifyPhaseFailure(reason: string, notifId: AggregateID): Result<Message> {
    const messageRes = Message.create(
      {
        type: MessageType.PHASE_FAILURE_NOTIFICATION,
        decisionType: DecisionType.PHASE_RETRY_DECISION,
        content: `La phase de soin a échoué : ${reason}. Voulez-vous réessayer ou ajuster le traitement ?`,
        requiresResponse: true,
      },
      notifId
    );
    if (messageRes.isFailure) {
      return messageRes;
    }
    this.sendMessage(messageRes.val);
    return messageRes;
  }

  notifyMissingVariables(
    missingVars: string[],
    notifId: AggregateID
  ): Result<Message> {
    const messageRes = Message.create(
      {
        type: MessageType.MISSING_VARIABLES_NOTIFICATION,
        decisionType: DecisionType.VARIABLE_PROVISION,
        content: `Variables manquantes pour continuer : ${missingVars.join(", ")}. Veuillez les fournir.`,
        requiresResponse: true,
      },
      notifId
    );
    if (messageRes.isFailure) {
      return messageRes;
    }
    this.sendMessage(messageRes.val);
    return messageRes;
  }

  requestUserDecision(
    question: string,
    decisionType: DecisionType,
    notifId: AggregateID
  ): Result<Message> {
    const messageRes = Message.create(
      {
        type: MessageType.USER_DECISION_REQUEST,
        decisionType: decisionType,
        content: question,
        requiresResponse: true,
      },
      notifId
    );
    if (messageRes.isFailure) {
      return messageRes;
    }
    this.sendMessage(messageRes.val);
    return messageRes;
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
