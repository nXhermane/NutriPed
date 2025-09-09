import { DomainDateTime, InfrastructureMapper } from "@/core/shared";
import { PatientCareSession } from "@/core/nutrition_care/domain/next/core/models/aggregate";
import {
  PatientCareSessionAggregatePersistenceDto,
  PatientCareSessionAggregatePersistenceRecordDto,
} from "../../../dtos/next/core";
import { UserResponseSummaryInfraMapper } from "./UserResponseSummaryMapper";
import { NextCore } from "@/core/nutrition_care";
export class PatientCareSessionAggregateInfraMapper
  implements
    InfrastructureMapper<
      PatientCareSession,
      PatientCareSessionAggregatePersistenceDto,
      PatientCareSessionAggregatePersistenceRecordDto
    >
{
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
        ? entity.getCurrentPhase()!.id
        : null,
      currentDailyRecord: entity.getCurrentDailyRecord()
        ? entity.getCurrentDailyRecord()!.id
        : null,
      phaseHistory: entity.getPhaseHistory().map(phase => phase.id),
      dailyRecords: entity.getDailyRecords().map(record => record.id),
      inbox: entity.getInbox().map(message => message.id),
      responses: entity
        .getResponses()
        .map(response => this.responseMapper.toPersistence(response)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(
    record: PatientCareSessionAggregatePersistenceRecordDto
  ): PatientCareSession {
    const props: NextCore.IPatientCareSession = {
      patientId: record.patientId,
      status: record.status,
      startDate: DomainDateTime.create(record.startDate).val,
      endDate: record.endDate
        ? DomainDateTime.create(record.endDate).val
        : null,
      currentPhase: record.currentPhase ? record.currentPhase : null,
      currentDailyRecord: record.currentDailyRecord
        ? record.currentDailyRecord
        : null,
      phaseHistory: record.phaseHistory,
      dailyRecords: record.dailyRecords,
      inbox: record.inbox,
      responses: record.responses.map(response =>
        this.responseMapper.toDomain(response)
      ),
    };

    const result = new PatientCareSession({
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      id: record.id,
      props: props,
    });

    return result;
  }
}
