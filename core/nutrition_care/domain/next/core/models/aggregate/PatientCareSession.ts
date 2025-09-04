import { CarePhase, DailyCareRecord } from "./../entities";
import {
  AggregateID,
  AggregateRoot,
  ArgumentOutOfRangeException,
  DomainDateTime,
  EntityPropsBaseType,
  handleError,
  InvalidObject,
  Result,
} from "@/core/shared";

export enum PatientCareSessionStatus {
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
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
}
export interface CreatePatientCareSession {
  patientId: AggregateID;
}
export class PatientCareSession extends AggregateRoot<IPatientCareSession> {
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
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
