import { AggregateID } from "@shared";
import { PatientDiagnosticDataDto } from "../../../../dtos";

export type UpdatePatientDiagnosticDataRequest = {
  nutritionalDiagnosticId: AggregateID;
  patientDiagnosticData: Partial<
    Omit<PatientDiagnosticDataDto, "id" | "createdAt" | "updatedAt">
  >;
};
