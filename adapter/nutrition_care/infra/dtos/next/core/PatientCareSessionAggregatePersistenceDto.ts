import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";
import { UserResponseSummaryPersistenceDto } from "./UserResponseSummaryPersistenceDto";

export interface PatientCareSessionAggregatePersistenceDto
  extends EntityPersistenceDto { patientId: AggregateID;
    status: NextCore.PatientCareSessionStatus;
    startDate: string;
    endDate: string | null;
    currentPhase: AggregateID | null;
    currentDailyRecord: AggregateID | null;
    phaseHistory: AggregateID[];
    dailyRecords: AggregateID[];
    inbox: AggregateID[];
    responses: UserResponseSummaryPersistenceDto[];

}

export interface PatientCareSessionAggregatePersistenceRecordDto extends EntityPersistenceDto {
  patientId: AggregateID;
  status: NextCore.PatientCareSessionStatus;
  startDate: string;
  endDate: string | null;
  currentPhase: NextCore.CarePhase | null;
  currentDailyRecord: NextCore.DailyCareRecord | null;
  phaseHistory: NextCore.CarePhase[];
  dailyRecords: NextCore.DailyCareRecord[];
  inbox: NextCore.Message[];
  responses: UserResponseSummaryPersistenceDto[];
}