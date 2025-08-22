import {
  AnthropometricDataContext,
  DataFieldResponseType,
} from "@core/medical_record";
import { EntityPersistenceDto } from "../../../shared";
import { AggregateID } from "@/core/shared";

export interface AnthropometricDataPersistenceDto {
  id: AggregateID;
  code: string;
  context: `${AnthropometricDataContext}`;
  recordedAt: string;
  unit: string;
  value: number;
}

export interface BiologicalDataPersistenceDto {
  id: AggregateID;
  code: string;
  recordedAt: string;
  unit: string;
  value: number;
}

export interface ClinicalDataPersistenceDto {
  id: AggregateID;
  code: string;

  data: Record<string, any>;
  isPresent: boolean;
  recordedAt: string;
}

export interface ComplicationDataPersistenceDto {
  id: AggregateID;
  code: string;
  recordedAt: string;
  isPresent: boolean;
}
export interface DataFieldResponsePersistenceDto {
  code: string;
  recordedAt: string;
  value: number | string | boolean;
  unit?: string;
  type: DataFieldResponseType;
}
export interface MedicalRecordPersistenceDto extends EntityPersistenceDto {
  patientId: AggregateID;
  anthropometricData: AnthropometricDataPersistenceDto[];
  biologicalData: BiologicalDataPersistenceDto[];
  clinicalData: ClinicalDataPersistenceDto[];
  complications: ComplicationDataPersistenceDto[];
  dataFieldsResponse: DataFieldResponsePersistenceDto[];
}
