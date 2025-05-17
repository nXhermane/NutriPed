import { AggregateID } from "@shared";
import {
   APPETITE_TEST_RESULT_CODES,
   CreateClinicalEvent,
   CreateMonitoringEntry,
   CreateNutritionalTreatmentAction,
} from "../../../domain";

export interface DailyCareJournalDto {
   id: AggregateID;
   date: string;
   dayNumber: number;
   monitoringValues: CreateMonitoringEntry[];
   observations: CreateClinicalEvent[];
   treatmentActions: CreateNutritionalTreatmentAction[];
   appetiteTestResults: { code: string; result: APPETITE_TEST_RESULT_CODES }[];
   createdAt: string;
   updatedAt: string;
}
