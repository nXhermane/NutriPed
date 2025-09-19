import { AggregateID } from "@shared";
import { OrientationResult } from "../../../domain";
import { PatientCurrentStateDto } from "./PatientCurrentStateDto";
import { DailyCareJournalDto } from "./DailyCareJournalDto";
import { CarePhaseDto } from "./CarePhase";

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
