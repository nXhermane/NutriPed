import { AggregateID } from "@shared";

export type AddNoteToNutritionalDiagnosticRequest = {
  nutritionalDiagnosticId: AggregateID;
  notes: { date: string, content: string }[];
};
