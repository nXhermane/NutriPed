import { AggregateID } from "@/core/shared";
import { PatientCareSessionStatus } from "@/core/nutrition_care/domain/next/core/models/aggregate";
import { CareMessageDto, DailyCareRecordDto, UserResponseSummaryDto, } from "./index";
import { CarePhaseDto } from "./CarePhaseDto";

export interface PatientCareSessionAggregateDto {
  id: AggregateID;
  patientId: AggregateID;
  status: PatientCareSessionStatus;
  startDate: string;
  endDate: string | null;
  currentPhase: CarePhaseDto | null;
  currentDailyRecord: DailyCareRecordDto | null;
  phaseHistory: CarePhaseDto[];
  dailyRecords: DailyCareRecordDto[];
  inbox: CareMessageDto[];
  responses: UserResponseSummaryDto[];
  createdAt: string;
  updatedAt: string;
}
