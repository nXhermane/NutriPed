import { AggregateID, Sex } from "@shared";
import { AnthropometricDataDto } from "../anthropometric";
import { ClinicalSignDto } from "../clinical";
import { EdemaData } from "../../../domain";
import { BiologicalTestResultDto } from "../biological";

export interface PatientDiagnosticDataDto {
   id: AggregateID;
   sex: `${Sex}`;
   birthday: string;
   anthropometricData: AnthropometricDataDto;
   clinicalData: {
      edema: ClinicalSignDto<EdemaData>;
      otherSigns: ClinicalSignDto<object>[];
   };
   biologicalTestResults: BiologicalTestResultDto[];
   createdAt: string;
   updatedAt: string;
}
