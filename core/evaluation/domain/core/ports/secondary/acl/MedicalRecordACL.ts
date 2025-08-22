import { APPETITE_TEST_PRODUCT_TYPE, DATA_FIELD_CODE_TYPE } from "@/core/constants";
import { DataFieldResponseValue } from "@/core/evaluation/domain/data_fields";
import { TakenAmountInSachet, TakenAmountOfPot } from "@/core/medical_record";
import { AggregateID, DomainDate, Result } from "@/core/shared";

export interface PatientData {
  anthroData: { code: string; value: number; unit: string }[];
  clinicalData: {
    code: string;
    isPresent: boolean;
    data: Record<string, any>;
  }[];
  biologicalData: { code: string; value: number; unit: string }[];
  dataFieldData: { code: DATA_FIELD_CODE_TYPE, data: DataFieldResponseValue }[]
}

export type AclAppetiteTestData = {
  id: AggregateID
  amount: TakenAmountInSachet | TakenAmountOfPot
  productType: APPETITE_TEST_PRODUCT_TYPE
  fieldResponses: Record<DATA_FIELD_CODE_TYPE, DataFieldResponseValue>
  recordedAt: string 
}

export interface MedicalRecordACL {
  getPatientData(data: {
    patientId: AggregateID;
  }): Promise<Result<PatientData>>;
  getAllAppetiteTestData(data: { patientId: AggregateID }): Promise<Result<AclAppetiteTestData[]>>
  getPatientDataBefore(data: {
    patientId: AggregateID
    date: DomainDate
  }): Promise<Result<PatientData >>
}
