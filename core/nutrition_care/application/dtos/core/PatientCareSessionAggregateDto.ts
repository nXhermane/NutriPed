import { AggregateID } from "@/core/shared";
import { PatientCareSessionStatus } from "@/core/nutrition_care/domain/next/core/models/aggregate";

export interface PatientCareSessionAggregateDto {
  id: AggregateID;
  patientId: AggregateID;
  status: PatientCareSessionStatus;
  startDate: string;
  endDate: string | null;
  currentPhase: any; // Will be properly typed later
  currentDailyRecord: any; // Will be properly typed later
  phaseHistory: any[]; // Will be properly typed later
  dailyRecords: any[]; // Will be properly typed later
  inbox: any[]; // Will be properly typed later
  responses: any[]; // Will be properly typed later
  createdAt: string;
  updatedAt: string;
}
