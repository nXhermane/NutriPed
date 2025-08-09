import { AggregateID } from "@shared";
import { PatientDiagnosticDataDto } from "./PatientDiagnosticDataDto";
import { NutritionalAssessmentResultDto } from "./NutritionalAssessmentResultDto";
import { DiagnosticModificationDto } from "./DiagnosticModificationDto";

export interface NutritionalDiagnosticDto {
  id: AggregateID;
  patientId: AggregateID;
  patientData: PatientDiagnosticDataDto;
  result?: NutritionalAssessmentResultDto;
  date: string;
  notes: { date: string, content: string }[];
  atInit: boolean;
  modificationHistories: DiagnosticModificationDto[];
  createAt: string;
  updatedAt: string;
}
