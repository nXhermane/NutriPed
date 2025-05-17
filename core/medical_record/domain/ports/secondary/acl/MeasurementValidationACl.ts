import { AggregateID, Result } from "@shared";
import { AnthropometricData, BiologicalValue, ClinicalSignData } from "../../../models";

export interface MeasurementData {
   anthropometricData: AnthropometricData[];
   clinicalData: ClinicalSignData[];
   biologicalData: BiologicalValue[];
}
export interface MeasurementValidationACL {
   validate(patientId: AggregateID, measurements: MeasurementData): Promise<Result<boolean>>;
}
