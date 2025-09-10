import { GenerateUniqueId, EntityUniqueID, Result, DomainDate } from "@shared";
import {
  PatientCareSession,
  DailyCareJournal,
  IPatientCareSession,
} from "@/core/nutrition_care/domain/core/models";
import { PatientDailyJournalGenerator } from "@/core/nutrition_care/domain/core/services";
import { CreateEntityProps } from "@/core/shared/domain/common/CreateEntityProps";

class MockGenerateUniqueId implements GenerateUniqueId {
  generate(): EntityUniqueID {
    return new EntityUniqueID("test-id");
  }
}

describe("PatientDailyJournalGenerator", () => {
  const idGenerator = new MockGenerateUniqueId();
  const service = new PatientDailyJournalGenerator(idGenerator);
  const patientId = new EntityUniqueID("patient-id");
  const startDate = new DomainDate();

  const createPatientCareSession = (
    props: Partial<IPatientCareSession>
  ): PatientCareSession => {
    const defaultProps: IPatientCareSession = {
      patientId: patientId,
      startDate: startDate,
      carePhases: [],
      currentState: {} as any,
      dailyJournals: [],
      orientation: {} as any,
      status: "in_progress",
    };

    const patientCareSessionProps: CreateEntityProps<IPatientCareSession> = {
      id: new EntityUniqueID("care-session-id"),
      props: { ...defaultProps, ...props },
    };

    return new PatientCareSession(patientCareSessionProps);
  };

  it("should create a new daily journal if one does not exist for the current day", () => {
    // Arrange
    const patientCareSession = createPatientCareSession({
      currentDailyJournal: undefined,
    });

    // Act
    const result = service.createDailyJournalIfNeeded(patientCareSession);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(patientCareSession.haveCurrentDailyJournal()).toBe(true);
    expect(patientCareSession.getCurrentJournal()?.id).toBe("test-id");
  });

  it("should not create a new daily journal if one already exists for the current day", () => {
    // Arrange
    const dailyJournal = DailyCareJournal.create(
      startDate.unpack(),
      "existing-journal"
    ).val;
    const patientCareSession = createPatientCareSession({
      currentDailyJournal: dailyJournal,
    });

    // Act
    const result = service.createDailyJournalIfNeeded(patientCareSession);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(patientCareSession.getCurrentJournal()?.id).toBe("existing-journal");
  });

  it("should return a failure result if the daily journal creation fails", () => {
    // Arrange
    const patientCareSession = createPatientCareSession({
      currentDailyJournal: undefined,
    });
    const spy = jest
      .spyOn(DailyCareJournal, "create")
      .mockReturnValue(Result.fail("Creation failed"));

    // Act
    const result = service.createDailyJournalIfNeeded(patientCareSession);

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe(
      "[Error on PatientDailyJournalGenerator]: Creation failed"
    );
    spy.mockRestore();
  });
});
