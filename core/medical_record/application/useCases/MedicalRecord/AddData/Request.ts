import { AggregateID } from "@shared";
import { MedicalRecordDto } from "./../../../dtos";

import {
  CreateAnthropometricRecord,
  CreateBiologicalValueRecord,
  CreateClinicalSignDataRecord,
  CreateComplicationDataRecord,
  CreateDataFieldResponse,
} from "./../../../../domain";

export type AddDataToMedicalRecordRequest = {
  medicalRecordId: AggregateID;
  data: Partial<{
    anthropometricData: CreateAnthropometricRecord[];
    clinicalData: Omit<CreateClinicalSignDataRecord, "isPresent">[];
    biologicalData: CreateBiologicalValueRecord[];
    complicationData: CreateComplicationDataRecord[];
    dataFieldResponses: CreateDataFieldResponse[];
  }>;
};
