import { AggregateID } from "@shared";
import { OrientationResult } from "../../../domain";
import { CarePhaseDto } from "./CarePhaseDto";
import { PatientCurrentStateDto } from "./PatientCurrentStateDto";
import { DailyCareJournalDto } from "./DailyCareJournalDto";

export interface PatientCareSessionDto {
  id: AggregateID;
  patientId: AggregateID;
  startDate: string;
  endDate?: string;
  orientation: OrientationResult;
  carePhases: CarePhaseDto[];
  currentState: PatientCurrentStateDto;
  dailyJournals: DailyCareJournalDto[];
  currentDailyJournal?: DailyCareJournalDto;
  status: "not_ready" | "in_progress" | "completed";
  createdAt: string;
  updatedAt: string;
}
