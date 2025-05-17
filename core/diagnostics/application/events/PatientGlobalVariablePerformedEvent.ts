import { AggregateID, DomainEvent, DomainEventMessage } from "@shared";
import { PatientGlobalVariables } from "../useCases";

export interface PatientGlobalVariablePerformedEventData {
   patientId: AggregateID;
   variables: PatientGlobalVariables;
}

@DomainEventMessage("Patient Global Variables performed.", true)
export class PatientGlobalVariablesPerformedEvent extends DomainEvent<PatientGlobalVariablePerformedEventData> {}
