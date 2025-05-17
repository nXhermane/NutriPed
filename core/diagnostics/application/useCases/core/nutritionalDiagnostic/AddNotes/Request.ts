import { AggregateID } from "@shared";

export type AddNoteToNutritionalDiagnosticRequest = {
   nutritionalDiagnosticId: AggregateID;
   notes: string[];
};
