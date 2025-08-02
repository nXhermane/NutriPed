import { AggregateID, Result } from "@shared";
import {
  AnthropometricRecord,
  BiologicalValueRecord,
  ClinicalSingDataRecord,
} from "../../../models/entities";

export interface MeasurementData {
  anthropometricData: AnthropometricRecord[];
  clinicalData: ClinicalSingDataRecord[];
  biologicalData: BiologicalValueRecord[];
}
export interface MeasurementValidationACL {
  validate(
    patientId: AggregateID,
    measurements: MeasurementData
  ): Promise<Result<boolean>>;
}
