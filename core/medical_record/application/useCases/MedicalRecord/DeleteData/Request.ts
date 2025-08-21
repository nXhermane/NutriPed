import { AggregateID } from "@/core/shared";

export type DeleteDataFromMedicalRecordRequest = {
  medicalRecordId: AggregateID;
  data: Partial<{
    anthropometricData: AggregateID[];
    clinicalData: AggregateID[];
    biologicalData: AggregateID[];
    complicationData: AggregateID[];
    dataFields: AggregateID[]
    appetiteTests: AggregateID[]
  }>;
};
