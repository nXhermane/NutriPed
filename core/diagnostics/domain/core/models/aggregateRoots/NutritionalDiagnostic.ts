import {
  AggregateID,
  AggregateRoot,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  DomainDate,
  EmptyStringError,
  EntityPropsBaseType,
  Guard,
  InvalidResultError,
} from "@shared";
import {
  NutritionalAssessmentResult,
  PatientDiagnosticData,
} from "../entities";
import { AnthropometricData } from "../../../anthropometry";
import { BiologicalTestResult } from "../../../biological";
import { ClinicalData } from "../../../clinical";
import { DiagnosticModification } from "../valueObjects";

export interface INutritionalDiagnostic extends EntityPropsBaseType {
  patientId: AggregateID;
  patientData: PatientDiagnosticData;
  result?: NutritionalAssessmentResult;
  date: DomainDate;
  notes: string[];
  atInit: boolean;
  modificationHistories: DiagnosticModification[];
}

export class NutritionalDiagnostic extends AggregateRoot<INutritionalDiagnostic> {
  getPatientId(): AggregateID {
    return this.props.patientId;
  }
  getPatientData(): PatientDiagnosticData {
    return this.props.patientData;
  }
  getDiagnosticResult(): NutritionalAssessmentResult | undefined {
    return this.props.result;
  }
  getNotes(): string[] {
    return this.props.notes;
  }
  getModificationHistories(): DiagnosticModification[] {
    return this.props.modificationHistories;
  }
  addNotes(...notes: string[]) {
    this.props.notes.push(...notes);
    this.validate();
  }
  changeAnthropometricData(anthropData: AnthropometricData) {
    this.props.patientData.changeAnthropometricData(anthropData);
    this.validate();
    // BETA:
    // this.init();
  }
  changeClinicalData(clinicalData: ClinicalData) {
    this.props.patientData.changeClinicalSigns(clinicalData);
    this.validate();
    // BETA: j'ai desactiver ceci d'abord
    // this.init();
  }
  changeBiologicalTestResult(
    biologicalAnalysisResults: BiologicalTestResult[]
  ) {
    this.props.patientData.addBiologicalTestResult(
      ...biologicalAnalysisResults
    );
    this.validate();
    // BETA:
    // this.init();
  }
  saveDiagnostic(patientDiagnosticResult: NutritionalAssessmentResult): void {
    // BETA: J'ai desativé pour des raisons de debugage
    // if (this.props.atInit) {
    this.props.result = patientDiagnosticResult;
    // }
    this.props.atInit = false;
  }
  correctDiagnostic(diagnosticModification: DiagnosticModification) {
    if (!this.props.atInit) {
      this.props.result = diagnosticModification.unpack().nextResult;
      this.props.modificationHistories.push(diagnosticModification);
    }
  }
  private init() {
    this.props.atInit = true;
    this.props.result = undefined;
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.patientId).succeeded)
      throw new InvalidResultError(
        "The reference to patient can't be empty. Please provide a valid patientId"
      );
    if (!this.props.atInit && Guard.isEmpty(this.props.result).succeeded)
      throw new ArgumentNotProvidedException(
        "The result of diagnostic must be provide when atInit equal to false."
      );
    if (this.props.notes.some(note => Guard.isEmpty(note).succeeded))
      throw new EmptyStringError("The nutritionist note can't be empty.");
    if (this.props.atInit && !Guard.isEmpty(this.props.result).succeeded)
      throw new ArgumentOutOfRangeException(
        "The result of diagnostic can't be provide when atInit equal to true."
      );
    this._isValid = true;
  }
}
