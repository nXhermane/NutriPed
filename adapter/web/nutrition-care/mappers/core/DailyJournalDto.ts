import { CreateMonitoringEntry, CreateClinicalEvent, CreateNutritionalTreatmentAction, APPETITE_TEST_RESULT_CODES } from "@core/nutrition_care";
import { EntityPersistenceDto } from "../../../common";

export interface DailyJournalPersistenceDto extends EntityPersistenceDto {
   date: string;
   dayNumber: number;
   monitoringValues: CreateMonitoringEntry[];
   observations: CreateClinicalEvent[];
   treatmentActions: CreateNutritionalTreatmentAction[];
   appetiteTestResults: { code: string; result: APPETITE_TEST_RESULT_CODES }[];
}
