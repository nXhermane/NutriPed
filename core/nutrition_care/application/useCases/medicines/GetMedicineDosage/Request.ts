import { AggregateID } from "@shared";

export type GetMedicineDosageRequest = {
   medicineId: AggregateID;
   patientWeightInKg: number;
};
