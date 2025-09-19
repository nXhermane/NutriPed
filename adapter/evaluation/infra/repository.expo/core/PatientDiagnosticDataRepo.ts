import {
  PatientDiagnosticData,
  PatientDiagnosticDataRepository,
} from "@/core/evaluation";
import { EntityBaseRepositoryExpo } from "../../../../shared";
import { PatientDiagnosticDataPersistenceDto } from "../..";
import { patient_diagnostic_data } from "../db";

export class PatientDiagnosticDataRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    PatientDiagnosticData,
    PatientDiagnosticDataPersistenceDto,
    typeof patient_diagnostic_data
  >
  implements PatientDiagnosticDataRepository {}
