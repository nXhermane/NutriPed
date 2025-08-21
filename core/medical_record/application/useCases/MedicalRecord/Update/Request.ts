import { CreateAppetiteTestRecord, CreateDataFieldResponse } from "./../../../../domain";
import { AggregateID } from "@shared";

export type UpdateMedicalRecordRequest = {
  medicalRecordId: AggregateID;
  data: Partial<{
    anthropometricData: {
      id: AggregateID;
      measurement: { unit: string; value: number };
    }[];
    clinicalData: { id: AggregateID; code: string; data: object }[];
    biologicalData: {
      id: AggregateID;
      measurement: { value: number; unit: string };
    }[];
    complicationData: { id: AggregateID; isPresent: boolean }[];
    dataFieldResponses: {id: AggregateID,data: CreateDataFieldResponse}[];
    appetiteTests: {
      id: AggregateID
      data: {
        amount: CreateAppetiteTestRecord['amount'],
        productType: CreateAppetiteTestRecord['productType']
      }
    }[]
  }>;
};
