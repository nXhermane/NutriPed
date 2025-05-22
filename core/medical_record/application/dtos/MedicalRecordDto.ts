import {
  CreateAnthropometricData,
  CreateBiologicalValue,
  CreateClinicalSignData,
  CreateComplicationData,
  CreateDataFieldResponse,
} from "./../../domain";
import { AggregateID } from "@shared";

export interface MedicalRecordDto {
  id: AggregateID;
  patientId: AggregateID;
  anthropometricData: (CreateAnthropometricData & { recordedAt: string })[];
  biologicalData: (CreateBiologicalValue & { recordedAt: string })[];
  clinicalData: (CreateClinicalSignData & { recordedAt: string })[];
  dataFieldResponse: (CreateDataFieldResponse & { recordedAt: string })[];
  complicationData: (CreateComplicationData & { recordedAt: string })[];
  updatedAt: string;
  createdAt: string;
}
