import {
  AnthropometricDataContext,
  DataFieldResponseValue,
  TakenAmountInSachet,
  TakenAmountOfPot,
} from "@core/medical_record";
import { EntityPersistenceDto } from "../../../shared";
import { AggregateID } from "@/core/shared";
import { APPETITE_TEST_PRODUCT_TYPE, DATA_FIELD_CODE_TYPE } from "@/core/constants";

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  id: AggregateID
  recordAt: string
  code: DATA_FIELD_CODE_TYPE;
  data: DataFieldResponseValue
}
export interface AppetiteTestReference {
  amount: TakenAmountOfPot | TakenAmountInSachet;
  productType: APPETITE_TEST_PRODUCT_TYPE;
  recordAt: string;
}
export interface MedicalRecordPersistenceDto extends EntityPersistenceDto {
  patientId: AggregateID;
  anthropometricData: AnthropometricDataPersistenceDto[];
  biologicalData: BiologicalDataPersistenceDto[];
  clinicalData: ClinicalDataPersistenceDto[];
  complications: ComplicationDataPersistenceDto[];
  dataFieldsResponse: DataFieldResponsePersistenceDto[];
}
