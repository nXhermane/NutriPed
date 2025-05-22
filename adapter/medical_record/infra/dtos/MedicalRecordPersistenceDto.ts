import {
  AnthropometricDataContext,
  DataFieldResponseType,
} from "@core/medical_record";
import { EntityPersistenceDto } from "../../../shared";

export interface AnthropometricDataPersistenceDto {
  code: string;
  context: AnthropometricDataContext;
  recordedAt: string;
  unit: string;
  value: number;
}

export interface BiologicalDataPersistenceDto {
  code: string;
  recordedAt: string;
  unit: string;
  value: number;
}

export interface ClinicalDataPersistenceDto {
  code: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
  recordedAt: string;
}

export interface ComplicationDataPersistenceDto {
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
  patientId: string;
  anthropometricData: AnthropometricDataPersistenceDto[];
  biologicalData: BiologicalDataPersistenceDto[];
  clinicalData: ClinicalDataPersistenceDto[];
  complications: ComplicationDataPersistenceDto[];
  dataFieldsResponse: DataFieldResponsePersistenceDto[];
}
