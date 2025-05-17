import { AggregateID } from "@shared";

export type GetNutritionalDiagnosticRequest = {
   nutritionalDiagnosticId?: AggregateID;
   patientId?: AggregateID;
};
