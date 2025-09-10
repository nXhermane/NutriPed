import { Sex } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";

export interface PatientDiagnosticDataPersistenceDto
  extends EntityPersistenceDto {
  sex: `${Sex}`;
  birthday: string;
  anthropMeasures: {
    code: string;
    value: number;
    unit: string;
  }[];
  clinicalSigns: {
    clinicalSigns: { code: string; data: Record<string, any> }[];
  };
  biologicalTestResults: { code: string; value: number; unit: string }[];
}
