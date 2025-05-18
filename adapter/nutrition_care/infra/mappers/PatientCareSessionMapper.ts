import {
  DailyCareJournal,
  PatientCareSession,
  PatientCareSessionStatus,
  PatientCurrentState,
} from "@core/nutrition_care";
import {
  DomainDate,
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
  SystemCode,
} from "@shared";
import {
  DailyJournalPersistenceDto,
  PatientCareSessionPersistenceDto,
  PatientCurrentStatePersistenceDto,
} from "../dtos";

export class PatientCareSessionInfraMapper
  implements
    InfrastructureMapper<PatientCareSession, PatientCareSessionPersistenceDto>
{
  constructor(
    private readonly patientCurrentStateMapper: InfrastructureMapper<
      PatientCurrentState,
      PatientCurrentStatePersistenceDto
    >,
    private readonly dailyJournalMapper: InfrastructureMapper<
      DailyCareJournal,
      DailyJournalPersistenceDto
    >
  ) {}
  toPersistence(entity: PatientCareSession): PatientCareSessionPersistenceDto {
    const { status, createdAt, updatedAt } = entity.getProps();
    return {
      id: entity.id as string,
      carePhases: [], // BETA: Je vais revoir ceci plustart ,
      orientation: {
        code: entity.getOrientation().code.unpack(),
        name: entity.getOrientation().name,
      },
      patientId: entity.getPatientId() as string,
      startDate: entity.getStartDate(),
      endDate: entity.getEndDate(),
      currentState: this.patientCurrentStateMapper.toPersistence(
        entity.getCurrentState()
      ),
      dailyJournals: entity
        .getDailyJournals()
        .map(this.dailyJournalMapper.toPersistence),
      currentDailyJournal: entity.getCurrentJournal()
        ? this.dailyJournalMapper.toPersistence(
            entity.getCurrentJournal() as DailyCareJournal
          )
        : undefined,
      status,
      updatedAt,
      createdAt,
    };
  }
  toDomain(record: PatientCareSessionPersistenceDto): PatientCareSession {
    const orientationCodeRes = SystemCode.create(record.orientation.code);
    if (orientationCodeRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(orientationCodeRes, PatientCareSessionInfraMapper.name)
      );
    }
    const orientation = {
      code: orientationCodeRes.val,
      name: record.orientation.name,
    };
    const patientCareSession = new PatientCareSession({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        carePhases: [],
        currentState: this.patientCurrentStateMapper.toDomain(
          record.currentState
        ),
        dailyJournals: record.dailyJournals.map(
          this.dailyJournalMapper.toDomain
        ),
        orientation: orientation,
        patientId: record.patientId,
        startDate: new DomainDate(record.startDate),
        status: record.status as PatientCareSessionStatus,
        currentDailyJournal: record.currentDailyJournal
          ? this.dailyJournalMapper.toDomain(record.currentDailyJournal)
          : undefined,
        currentPhase: undefined,
        endDate: record.endDate ? new DomainDate(record.endDate) : undefined,
      },
    });
    return patientCareSession;
  }
}
