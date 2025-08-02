import { AggregateID } from "@shared";
import {
  CreateAnthropometricRecord,
  CreateBiologicalValueRecord,
  CreateClinicalSignDataRecord,
  CreateComplicationDataRecord,
} from "../../domain/models/entities";
import { CreateDataFieldResponse } from "../../domain";

export interface MedicalRecordDto {
  id: AggregateID;
  patientId: AggregateID;
  anthropometricData: (CreateAnthropometricRecord & {
    recordedAt: string;
    id: AggregateID;
  })[];
  biologicalData: (CreateBiologicalValueRecord & {
    recordedAt: string;
    id: AggregateID;
  })[];
  clinicalData: (CreateClinicalSignDataRecord & {
    recordedAt: string;
    id: AggregateID;
  })[];
  dataFieldResponse: (CreateDataFieldResponse & { recordedAt: string })[];
  complicationData: (CreateComplicationDataRecord & {
    recordedAt: string;
    id: AggregateID;
  })[];
  updatedAt: string;
  createdAt: string;
}
