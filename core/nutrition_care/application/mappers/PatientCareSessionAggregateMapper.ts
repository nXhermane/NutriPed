import { ApplicationMapper } from "@/core/shared";
import { PatientCareSessionAggregateDto } from "../dtos";
import { PatientCareSession } from "../../domain/next/core/models/aggregate";
import { CareMessageDto, CarePhaseDto, DailyCareRecordDto } from "../dtos/core";
import { CarePhase, DailyCareRecord, Message } from "../../domain/next";

export class PatientCareSessionAggregateMapper implements ApplicationMapper<PatientCareSession, PatientCareSessionAggregateDto> {
  constructor(private readonly carePhaseMapper: ApplicationMapper<CarePhase, CarePhaseDto>, private readonly dailyRecordMapper: ApplicationMapper<DailyCareRecord, DailyCareRecordDto>,private readonly messageMapper: ApplicationMapper<Message,CareMessageDto>) { }
  toResponse(entity: PatientCareSession): PatientCareSessionAggregateDto {
    const {currentDailyRecord,currentPhase,dailyRecords,phaseHistory,inbox} = entity.getProps()
    return {
      id: entity.id,
      patientId: entity.getPatientId(),
      status: entity.getStatus(),
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate(),
      currentPhase : currentPhase ? this.carePhaseMapper.toResponse(currentPhase) : null,
      currentDailyRecord: currentDailyRecord ? this.dailyRecordMapper.toResponse(currentDailyRecord) : null ,
      phaseHistory: phaseHistory.map(phase => this.carePhaseMapper.toResponse(phase)),
      dailyRecords: dailyRecords.map(record => this.dailyRecordMapper.toResponse(record)),
      inbox: inbox.map(message => this.messageMapper.toResponse(message)),
      responses: entity.getResponses().map(response => ({
        decisionData: response.getDecisionData(),
        messageId: response.getMessageId(),
        response: response.getResponse(),
        timestamp: response.getTimestamp()
      })) ,
      createdAt: entity.createdAt.toString(),
      updatedAt: entity.updatedAt.toString(),
    };
  }
}
