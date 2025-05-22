import { Result } from "@shared";
import { PatientDiagnosticData } from "../../../models";
import { ValidateResult } from "../../../../common";

export interface IPatientDataValidationService {
  validate(patientData: PatientDiagnosticData): Promise<Result<ValidateResult>>;
}
