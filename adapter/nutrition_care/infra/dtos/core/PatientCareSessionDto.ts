import { OrientationResult, CarePhaseDto, PatientCareSessionStatus } from "@core/nutrition_care";
import { EntityPersistenceDto } from "../../../../shared";
import { DailyJournalPersistenceDto } from "./DailyJournalDto";
import { PatientCurrentStatePersistenceDto } from "./PatientCurrentStateDto";


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
