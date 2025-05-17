import { OrientationResult, CarePhaseDto, PatientCareSessionStatus } from "@core/nutrition_care";
import { EntityPersistenceDto } from "../../../common";
import { PatientCurrentStatePersistenceDto } from "./PatientCurrentStateDto";
import { DailyJournalPersistenceDto } from "./DailyJournalDto";

export interface PatientCareSessionPersistenceDto extends EntityPersistenceDto {
   patientId: string;
   startDate: string;
   endDate?: string;
   orientation: OrientationResult;
   carePhases: CarePhaseDto[];
   currentState: PatientCurrentStatePersistenceDto;
   dailyJournals: DailyJournalPersistenceDto[];
   currentDailyJournal?: DailyJournalPersistenceDto;
   status: `${PatientCareSessionStatus}`;
}
