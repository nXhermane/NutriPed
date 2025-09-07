import { InfrastructureMapper } from "@/core/shared";
import { PatientCareSession } from "@/core/nutrition_care/domain/next/core/models/aggregate";
import { PatientCareSessionAggregatePersistenceDto } from "../../../dtos/next/core";
import { CarePhaseInfraMapper } from "./CarePhaseMapper";
import { DailyCareRecordInfraMapper } from "./DailyCareRecordMapper";
import { MessageInfraMapper } from "./MessageMapper";
import { UserResponseSummaryInfraMapper } from "./UserResponseSummaryMapper";

export class PatientCareSessionAggregateInfraMapper
  implements
    InfrastructureMapper<
      PatientCareSession,
      PatientCareSessionAggregatePersistenceDto
    >
{
  private carePhaseMapper = new CarePhaseInfraMapper();
  private dailyRecordMapper = new DailyCareRecordInfraMapper();
  private messageMapper = new MessageInfraMapper();
  private responseMapper = new UserResponseSummaryInfraMapper();

  toPersistence(
    entity: PatientCareSession
  ): PatientCareSessionAggregatePersistenceDto {
    return {
      id: entity.id as string,
      patientId: entity.getPatientId(),
      status: entity.getStatus(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate(),
      currentPhase: entity.getCurrentPhase()
        ? this.carePhaseMapper.toPersistence(entity.getCurrentPhase()!)
        : null,
      currentDailyRecord: entity.getCurrentDailyRecord()
        ? this.dailyRecordMapper.toPersistence(entity.getCurrentDailyRecord()!)
        : null,
      phaseHistory: entity
        .getPhaseHistory()
        .map(phase => this.carePhaseMapper.toPersistence(phase)),
      dailyRecords: entity
        .getDailyRecords()
        .map(record => this.dailyRecordMapper.toPersistence(record)),
      inbox: entity
        .getInbox()
        .map(message => this.messageMapper.toPersistence(message)),
      responses: entity
        .getResponses()
        .map(response => this.responseMapper.toPersistence(response)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(
    record: PatientCareSessionAggregatePersistenceDto
  ): PatientCareSession {
    throw new Error("toDomain not implemented");
  }
}
