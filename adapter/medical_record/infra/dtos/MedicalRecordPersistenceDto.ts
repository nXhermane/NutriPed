import {
  AnthropometricDataContext,
  DataFieldResponseValue,
  TakenAmountInSachet,
  TakenAmountOfPot,
} from "@core/medical_record";
import { EntityPersistenceDto } from "../../../shared";
import { AggregateID } from "@/core/shared";
import {
  APPETITE_TEST_PRODUCT_TYPE,
  CARE_PHASE_CODES,
  DATA_FIELD_CODE_TYPE,
} from "@/core/constants";

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
  id: AggregateID;
  recordAt: string;
  code: DATA_FIELD_CODE_TYPE;
  data: DataFieldResponseValue;
}
export interface AppetiteTestRecordPersistenceDto {
  id: AggregateID;
  amount: TakenAmountOfPot | TakenAmountInSachet;
  productType: APPETITE_TEST_PRODUCT_TYPE;
  fieldResponses: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>;
  recordAt: string;
}
export interface OrientationRecordPersistenceDto {
  id: AggregateID;
  code: string;
  treatmentPhase: CARE_PHASE_CODES | null;
  recordedAt: string;
}
export interface MedicalRecordPersistenceDto extends EntityPersistenceDto {
  patientId: AggregateID;
  anthropometricData: AnthropometricDataPersistenceDto[];
  biologicalData: BiologicalDataPersistenceDto[];
  clinicalData: ClinicalDataPersistenceDto[];
  complications: ComplicationDataPersistenceDto[];
  dataFieldsResponse: DataFieldResponsePersistenceDto[];
  appetiteTests: AppetiteTestRecordPersistenceDto[];
}
