import { ApplicationMapper } from "@shared";
import {
  CarePhase,
  DailyCareJournal,
  PatientCareSession,
  PatientCurrentState,
} from "../../domain";
import {
  DailyCareJournalDto,
  PatientCareSessionDto,
  PatientCurrentStateDto,
} from "../dtos";
import { CarePhaseDto } from "../dtos/core";

export class PatientCareSessionMapper
  implements ApplicationMapper<PatientCareSession, PatientCareSessionDto>
{
  constructor(
    private carePhaseMapper: ApplicationMapper<CarePhase, CarePhaseDto>,
    private currentState: ApplicationMapper<
      PatientCurrentState,
      PatientCurrentStateDto
    >,
    private dailyJournal: ApplicationMapper<
      DailyCareJournal,
      DailyCareJournalDto
    >
  ) {}
  toResponse(entity: PatientCareSession): PatientCareSessionDto {
    const {
      carePhases,
      orientation,
      currentState,
      dailyJournals,
      currentDailyJournal,
      status,
    } = entity.getProps();
    return {
      id: entity.id,
      patientId: entity.getPatientId(),
      carePhases: carePhases.map(this.carePhaseMapper.toResponse),
      orientation: orientation,
      startDate: entity.getStartDate(),
      currentState: this.currentState.toResponse(currentState),
      dailyJournals: dailyJournals.map(this.dailyJournal.toResponse),
      currentDailyJournal: currentDailyJournal
        ? this.dailyJournal.toResponse(currentDailyJournal)
        : undefined,
      status: status,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
