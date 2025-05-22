import {
  AggregateID,
  DomainDate,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  Result,
} from "@shared";
import {
  CareDecision,
  ClinicalEvent,
  ICareDecision,
  IClinicalEvent,
  IMonitoringEntry,
  INutritionalTreatmentAction,
  MonitoringEntry,
  NutritionalTreatmentAction,
} from "../valueObjects";
import { AppetiteTestResult } from "../../../modules";

export interface IDailyCareJournal extends EntityPropsBaseType {
  date: DomainDate;
  dayNumber: number;
  monitoringValues: MonitoringEntry[];
  observations: ClinicalEvent[];
  treatmentActions: NutritionalTreatmentAction[];
  appetiteTestResults: AppetiteTestResult[];
  careDecisions: CareDecision[];
}

export class DailyCareJournal extends Entity<IDailyCareJournal> {
  getDate(): string {
    return this.props.date.unpack();
  }
  getDayNumber(): number {
    return this.props.dayNumber;
  }
  getMonitoringValues(): IMonitoringEntry[] {
    return this.props.monitoringValues.map(valObj => valObj.unpack());
  }
  getObservations(): IClinicalEvent[] {
    return this.props.observations.map(valObj => valObj.unpack());
  }
  getTreatmentActions(): INutritionalTreatmentAction[] {
    return this.props.treatmentActions.map(valObj => valObj.unpack());
  }
  getCareDecisions(): ICareDecision[] {
    return this.props.careDecisions.map(valObj => valObj.unpack());
  }
  getAppetiteTestResults() {
    return this.props.appetiteTestResults.map(valObj => valObj.unpack());
  }
  addMonitoringValue(monitoringEntry: MonitoringEntry) {
    this.props.monitoringValues.push(monitoringEntry);
  }
  addAction(action: NutritionalTreatmentAction) {
    this.props.treatmentActions.push(action);
  }
  addClinicalEvent(clinicalEvent: ClinicalEvent) {
    this.props.observations.push(clinicalEvent);
  }
  addAppetiteTestResult(appetiteTestResult: AppetiteTestResult) {
    this.props.appetiteTestResults.push(appetiteTestResult);
  }
  changeMonitoringValues(monitoringValues: MonitoringEntry[]) {
    this.props.monitoringValues = monitoringValues;
  }
  changeObservations(observations: ClinicalEvent[]) {
    this.props.observations = observations;
  }
  changeTreatmentActions(actions: NutritionalTreatmentAction[]) {
    this.props.treatmentActions = actions;
  }
  changeAppetiteTestResults(appetiteTestResults: AppetiteTestResult[]) {
    this.props.appetiteTestResults = appetiteTestResults;
  }
  public validate(): void {
    this._isValid = false;
    this._isValid = true;
  }
  static create(
    treatmentStartDate: string,
    id: AggregateID
  ): Result<DailyCareJournal> {
    try {
      const startDateRes = DomainDate.create(treatmentStartDate);
      if (startDateRes.isFailure)
        return Result.fail(formatError(startDateRes, DailyCareJournal.name));
      const date = new DomainDate();
      const dailyJournal = new DailyCareJournal({
        id,
        props: {
          date,
          dayNumber: date.diffInDays(startDateRes.val),
          careDecisions: [],
          monitoringValues: [],
          observations: [],
          appetiteTestResults: [],
          treatmentActions: [],
        },
      });
      return Result.ok(dailyJournal);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
