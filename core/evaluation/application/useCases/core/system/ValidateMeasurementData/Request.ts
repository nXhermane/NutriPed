import {
  AnthropometricDataDto,
  ClinicalSignDto,
  BiologicalTestResultDto,
} from "../../../../dtos";

import { AggregateID } from "@shared";

export type ValidateMeasurementsRequest = {
  patientId: AggregateID;
  anthropometricData: AnthropometricDataDto;
  clinicalData: ClinicalSignDto<object>[];
  biologicalTestResults: BiologicalTestResultDto[];
};
