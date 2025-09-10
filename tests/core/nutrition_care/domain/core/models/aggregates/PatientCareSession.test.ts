import {
  PatientCareSession,
  IPatientCareSession,
  PatientCareSessionStatus,
} from "@/core/nutrition_care/domain/core/models/aggregates/PatientCareSession";
import { DailyCareJournal } from "@/core/nutrition_care/domain/core/models/entities/DailyCareJournal";
import {
  CreateEntityProps,
  EntityUniqueID,
  DomainDate,
  DateManager,
} from "@shared";

describe("PatientCareSession", () => {
  const createPatientCareSession = (
    props: Partial<IPatientCareSession>
  ): PatientCareSession => {
    const defaultProps: IPatientCareSession = {
      patientId: new EntityUniqueID("patient-id"),
      startDate: new DomainDate(),
      carePhases: [],
      currentState: {
        addAnthropometricData: jest.fn(),
        addBiologicalData: jest.fn(),
        addClinicalSignData: jest.fn(),
        addComplication: jest.fn(),
        addAppetiteTestResult: jest.fn(),
        addOtherData: jest.fn(),
      } as any,
      dailyJournals: [],
      orientation: {} as any,
      status: PatientCareSessionStatus.IN_PROGRESS,
      endDate: undefined,
      currentDailyJournal: undefined,
    };

    const patientCareSessionProps: CreateEntityProps<IPatientCareSession> = {
      id: new EntityUniqueID("care-session-id"),
      props: { ...defaultProps, ...props },
    };

    return new PatientCareSession(patientCareSessionProps);
  };

  it("should add a daily journal", () => {
    // Arrange
    const patientCareSession = createPatientCareSession({});
    const today = DateManager.formatDate(new Date());
    const dailyJournal = DailyCareJournal.create(today, "journal-id").val;

    // Act
    patientCareSession.addDailyJournal(dailyJournal);

    // Assert
    expect(patientCareSession.haveCurrentDailyJournal()).toBe(true);
    expect(patientCareSession.getCurrentJournal()).toBe(dailyJournal);
  });

  it("should throw an error if the daily journal is not for today", () => {
    // Arrange
    const patientCareSession = createPatientCareSession({});
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = DateManager.formatDate(yesterday);

    const dailyJournal = DailyCareJournal.create(
      yesterdayStr,
      "journal-id"
    ).val;
    // Manually setting the date because DailyCareJournal.create always creates a journal for today
    (dailyJournal as any).props.date = new DomainDate(yesterdayStr);

    // Act & Assert
    expect(() => patientCareSession.addDailyJournal(dailyJournal)).toThrow(
      "The added journal is not of today.Please only the day journal can't be added."
    );
  });

  it("should end the care session", () => {
    // Arrange
    const patientCareSession = createPatientCareSession({});

    // Act
    patientCareSession.endCareSession();

    // Assert
    expect(patientCareSession.getProps().status).toBe(
      PatientCareSessionStatus.COMPLETED
    );
    expect(patientCareSession.getEndDate()).toBeDefined();
  });
});
