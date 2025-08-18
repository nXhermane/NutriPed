import { AggregateID, Sex } from "@shared";
import { AnthropometricDataDto } from "../anthropometric";
import { ClinicalSignDto } from "../clinical";
import { BiologicalTestResultDto } from "../biological";

export interface PatientDiagnosticDataDto {
  id: AggregateID;
  sex: `${Sex}`;
  birthday: string;
  anthropometricData: AnthropometricDataDto;
  clinicalData: {
    clinicalSigns: ClinicalSignDto<object>[];
  };
  biologicalTestResults: BiologicalTestResultDto[];
  createdAt: string;
  updatedAt: string;
}
