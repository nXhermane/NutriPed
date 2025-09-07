import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";
import { CarePhasePersistenceDto } from "./CarePhasePersistenceDto";
import { DailyCareRecordPersistenceDto } from "./DailyCareRecordPersistenceDto";
import { MessagePersistenceDto } from "./MessagePersistenceDto";
import { UserResponseSummaryPersistenceDto } from "./UserResponseSummaryPersistenceDto";

export interface PatientCareSessionAggregatePersistenceDto extends EntityPersistenceDto {
  patientId: AggregateID;
  status: NextCore.PatientCareSessionStatus;
  startDate: string;
  endDate: string | null;
  currentPhase: CarePhasePersistenceDto | null;
  currentDailyRecord: DailyCareRecordPersistenceDto | null;
  phaseHistory: CarePhasePersistenceDto[];
  dailyRecords: DailyCareRecordPersistenceDto[];
  inbox: MessagePersistenceDto[];
  responses: UserResponseSummaryPersistenceDto[];
}
