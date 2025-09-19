import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";
import { CarePhaseDto } from "./CarePhaseDto";
import { DailyCareRecordDto } from "./DailyCareRecordDto";
import { MessageDto } from "./Message";
import { UserResponseSummaryDto } from "./UserResponseSummaryDto";

export interface PatientCareSessionAggregateDto {
  id: AggregateID;
  patientId: AggregateID;
  status: NextCore.PatientCareSessionStatus;
  startDate: string;
  endDate: string | null;
  currentPhase: CarePhaseDto | null;
  currentDailyRecord: DailyCareRecordDto | null;
  phaseHistory: CarePhaseDto[];
  dailyRecords: DailyCareRecordDto[];
  inbox: MessageDto[];
  responses: UserResponseSummaryDto[];
  createdAt: string;
  updatedAt: string;
}
