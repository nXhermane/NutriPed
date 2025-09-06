import { ApplicationMapper } from "@/core/shared";
import { PatientCareSessionAggregateDto } from "../dtos";
import { PatientCareSession } from "../../domain/next/core/models/aggregate";

export class PatientCareSessionAggregateMapper implements ApplicationMapper<PatientCareSession, PatientCareSessionAggregateDto> {
  toResponse(entity: PatientCareSession): PatientCareSessionAggregateDto {
    return {
      id: entity.id,
      patientId: entity.getPatientId(),
      status: entity.getStatus(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate(),
      currentPhase: entity.getCurrentPhase()?.getProps() || null,
      currentDailyRecord: entity.getCurrentDailyRecord()?.getProps() || null,
      phaseHistory: entity.getPhaseHistory().map(phase => phase.getProps()),
      dailyRecords: entity.getDailyRecords().map(record => record.getProps()),
      inbox: entity.getInbox().map(message => message.getProps()),
      responses: entity.getResponses() as any,
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
