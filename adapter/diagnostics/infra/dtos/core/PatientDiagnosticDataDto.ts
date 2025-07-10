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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clinicalSigns: { code: string; data: Record<string, any> }[];
  };
  biologicalTestResults: { code: string; value: number; unit: string }[];
}
