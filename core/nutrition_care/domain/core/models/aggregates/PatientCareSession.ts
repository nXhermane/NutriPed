import {
  AggregateID,
  AggregateRoot,
  ArgumentInvalidException,
  ConditionResult,
  CreateEntityProps,
  DomainDate,
  EntityPropsBaseType,
  Guard,
  IllegalStateException,
  InvalidReference,
} from "@shared";
import { AppetiteTestResult, OrientationResult } from "../../../modules";
import { CarePhase, DailyCareJournal, PatientCurrentState } from "../entities";
import {
  ClinicalEvent,
  ClinicalEventType,
  MonitoringEntry,
  MonitoringEntryType,
  NutritionalTreatmentAction,
} from "../valueObjects";
import { PatientCareSessionCreatedEvent } from "../../events";
import {
  AnthroSystemCodes,
  COMPLICATION_CODES,
  ORIENTATION_REF_CODES,
  TREATMENT_HISTORY_VARIABLES_CODES,
} from "@/core/constants";
import { APPETITE_TEST_RESULT_CODES } from "../../../modules";
export enum PatientCareSessionStatus {
  NOT_READY = "not_ready",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
}
export interface IPatientCareSession extends EntityPropsBaseType {
  patientId: AggregateID;
  startDate: DomainDate;
  endDate?: DomainDate;
  orientation: OrientationResult;
  carePhases: CarePhase[];
  currentPhase?: CarePhase;
  currentState: PatientCurrentState;
  dailyJournals: DailyCareJournal[];
  currentDailyJournal?: DailyCareJournal;
  status: PatientCareSessionStatus;
}
//BETA:  On peut avoir dans la version suivante la notion de treatment active, qui lui va intégrer la notion de durée du traitement

export class PatientCareSession extends AggregateRoot<IPatientCareSession> {
  constructor(createProps: CreateEntityProps<IPatientCareSession>) {
    super(createProps);
    this.saveJournal();
  }
  getPatientId(): AggregateID {
    return this.props.patientId;
  }
  getStartDate(): string {
    return this.props.startDate.unpack();
  }
  getEndDate(): string | undefined {
    return this.props.endDate?.unpack();
  }
  getOrientation(): OrientationResult {
    return this.props.orientation;
  }
  getCarePhases(): CarePhase[] {
    return this.props.carePhases;
  }
  getCurrentState(): PatientCurrentState {
    return this.props.currentState;
  }
  getDailyJournals(): DailyCareJournal[] {
    return this.props.dailyJournals;
  }
  getCurrentJournal() {
    return this.props.currentDailyJournal;
  }
  addDailyJournal(dailyJournal: DailyCareJournal) {
    if (!dailyJournal.getProps().date.isSameDay(new DomainDate())) {
      throw new ArgumentInvalidException(
        "The added journal is not of today.Please only the day journal can't be added."
      );
    }

    if (!this.haveCurrentDailyJournal()) {
      this.props.currentDailyJournal = dailyJournal;
    }
  }
  addMonitoringValueToJournal(monitoringEntry: MonitoringEntry) {
    this.checkIfDailyJournalIsAdded();
    this.props.currentDailyJournal?.addMonitoringValue(monitoringEntry);
    const { type, code, date, value } = monitoringEntry.unpack();
    if (type != MonitoringEntryType.BIOCHEMICAL) {
      this.props.currentState.addAnthropometricData(
        code.unpack() as never,
        value,
        date
      );
    } else {
      this.props.currentState.addBiologicalData(
        code.unpack() as never,
        value,
        date
      );
    }
  }
  addActionToJournal(action: NutritionalTreatmentAction) {
    this.checkIfDailyJournalIsAdded();
    this.props.currentDailyJournal?.addAction(action);
  }
  addClinicalEventToJournal(clinicalEvent: ClinicalEvent) {
    this.checkIfDailyJournalIsAdded();
    this.props.currentDailyJournal?.addClinicalEvent(clinicalEvent);
    const { code, type, isPresent } = clinicalEvent.unpack();
    if (type === ClinicalEventType.CLINICAL) {
      this.props.currentState.addClinicalSignData(
        code.unpack() as never,
        isPresent ? ConditionResult.True : ConditionResult.False,
        new DomainDate()
      );
    } else {
      this.props.currentState.addComplication(
        code.unpack(),
        isPresent ? ConditionResult.True : ConditionResult.False,
        new DomainDate()
      );
    }
  }
  addAppetiteTestToJournal(appetiteTestResult: AppetiteTestResult) {
    this.checkIfDailyJournalIsAdded();
    this.props.currentDailyJournal?.addAppetiteTestResult(appetiteTestResult);
    const { code, result } = appetiteTestResult.unpack();
    this.props.currentState.addAppetiteTestResult(
      code.unpack(),
      result,
      new DomainDate()
    );
  }

  changeOrientationResult(orientationResult: OrientationResult) {
    // BETA:
    this.props.currentState.addOtherData(
      TREATMENT_HISTORY_VARIABLES_CODES.PREVIOUS_TREATMENT,
      this.props.orientation.code.unpack() as any
    );
    // CHANGE: I
    this.props.orientation = orientationResult;
  }
  changeStatus(status: PatientCareSessionStatus) {
    this.props.status = status;
  }
  haveCurrentDailyJournal(): boolean {
    return this.props.currentDailyJournal != undefined;
  }
  isNotReady(): boolean {
    return this.props.status === PatientCareSessionStatus.NOT_READY;
  }
  endCareSession() {
    this.props.status = PatientCareSessionStatus.COMPLETED;
    this.props.endDate = new DomainDate();
  }

  /**
   * Checks if the patient can transition from Phase 1 to the Transition Phase.
   * Based on the protocol: return of appetite, start of edema reduction, and clinical stability.
   */
  canTransitionToNextPhase(): boolean {
    const currentState = this.props.currentState.getProps();
    const complicationVars =
      this.props.currentState.getComplicationVariables();

    // 1. Check for return of appetite
    const appetiteOk =
      currentState.appetiteTestResult?.appetite_test_result?.value ===
      APPETITE_TEST_RESULT_CODES.SUCCESS;

    // 2. Check for clinical stability (no major complications)
    const isClinicallyStable =
      complicationVars[COMPLICATION_CODES.COMPLICATIONS_NUMBER] === 0;

    // 3. Check for start of edema reduction
    // The protocol requires "début de la fonte des œdèmes".
    // A simple check is that edema is not at its maximum level (+++).
    // A more complex check would involve comparing with the initial edema.
    const edemaIsReducing =
      (currentState.anthropometricData[AnthroSystemCodes.OEDEMA]?.value ?? 0) <
      3;

    return appetiteOk && isClinicallyStable && edemaIsReducing;
  }

  /**
   * Checks if the patient can be transferred from CNT to CNA.
   * Based on the protocol: good appetite, no edema, and no complications.
   */
  canBeTransferredToCNA(): boolean {
    const currentState = this.props.currentState.getProps();
    const complicationVars =
      this.props.currentState.getComplicationVariables();

    // 1. Check for good appetite
    const appetiteOk =
      currentState.appetiteTestResult?.appetite_test_result?.value ===
      APPETITE_TEST_RESULT_CODES.SUCCESS;

    // 2. Check for absence of medical complications
    const noComplications =
      complicationVars[COMPLICATION_CODES.COMPLICATIONS_NUMBER] === 0;

    // 3. Check for total resolution of edema
    const noEdema =
      currentState.anthropometricData[AnthroSystemCodes.OEDEMA]?.value === 0;

    return appetiteOk && noComplications && noEdema;
  }

  private checkIfDailyJournalIsAdded() {
    if (!this.haveCurrentDailyJournal()) {
      throw new IllegalStateException(
        "Please add the daily journal of the day. Before add anything to patient treatment context."
      );
    }
  }
  private saveJournal() {
    if (this.haveCurrentDailyJournal()) {
      const journalDate = new DomainDate(
        this.props.currentDailyJournal?.getDate()
      );
      if (!journalDate.isSameDay(new DomainDate())) {
        this.props.dailyJournals.push(this.props.currentDailyJournal!);
        this.props.currentDailyJournal = undefined;
      }
    }
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.patientId).succeeded) {
      throw new InvalidReference("The patient id can't be empty.");
    }
    this._isValid = true;
  }
  override created(): void {
    this.addDomainEvent(
      new PatientCareSessionCreatedEvent({
        id: this.getID(),
        patientId: this.getPatientId(),
      })
    );
  }
}
