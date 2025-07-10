import { Result } from "@shared";
import { PatientCurrentState } from "../../../models";
import { OrientationResult } from "../../../../modules";

export interface IOrientPatientService {
  orient(
    patientCurrentState: PatientCurrentState
  ): Promise<Result<OrientationResult>>;
}
