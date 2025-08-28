import { AggregateID } from "@shared";

import {
  CreateAnthropometricRecord,
  CreateAppetiteTestRecord,
  CreateBiologicalValueRecord,
  CreateClinicalSignDataRecord,
  CreateComplicationDataRecord,
  CreateDataFieldResponse,
  CreateOrientationRecord,
} from "./../../../../domain";

export type AddDataToMedicalRecordRequest = {
  medicalRecordId: AggregateID;
  data: Partial<{
    anthropometricData: CreateAnthropometricRecord[];
    clinicalData: Omit<CreateClinicalSignDataRecord, "isPresent">[];
    biologicalData: CreateBiologicalValueRecord[];
    complicationData: CreateComplicationDataRecord[];
    dataFieldResponses: CreateDataFieldResponse[];
    appetiteTests: CreateAppetiteTestRecord[];
    orientationRecords: CreateOrientationRecord[];
  }>;
};
