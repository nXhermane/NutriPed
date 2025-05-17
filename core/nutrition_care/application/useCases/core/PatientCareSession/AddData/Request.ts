import { AggregateID } from "@shared";
import { CreateClinicalEvent, CreateMonitoringEntry } from "../../../../../domain";

export type AddDataToPatientCareSessionRequest = {
   patientOrPatientCareId: AggregateID;
   monitoringValues: CreateMonitoringEntry[];
   clinicalEvents: CreateClinicalEvent[];
};
