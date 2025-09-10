import {
  PatientCareSession,
  PatientCareSessionStatus,
} from "@/core/nutrition_care/domain/next/core/models/aggregate/PatientCareSession";
import { CarePhase } from "@/core/nutrition_care/domain/next/core/models/entities/CarePhase";
import { DailyCareRecord } from "@/core/nutrition_care/domain/next/core/models/entities/DailyCareRecord";
import { DomainDateTime, Result } from "@/core/shared";

jest.mock("@/core/nutrition_care/domain/next/core/models/entities/CarePhase");
jest.mock(
  "@/core/nutrition_care/domain/next/core/models/entities/DailyCareRecord"
);

describe("PatientCareSession", () => {
  beforeEach(() => {
    (CarePhase.create as jest.Mock).mockReturnValue(Result.ok({} as CarePhase));
    (DailyCareRecord.create as jest.Mock).mockReturnValue(
      Result.ok({
        getDate: () => DomainDateTime.now().toString(),
      } as DailyCareRecord)
    );
  });

  it("should create a new patient care session", () => {
    // Arrange
    const props = { patientId: "patient-id" };

    // Act
    const result = PatientCareSession.create(props, "session-id");

    // Assert
    expect(result.isSuccess).toBe(true);
    const session = result.val;
    expect(session.id).toBe("session-id");
    expect(session.getStatus()).toBe(PatientCareSessionStatus.IN_PROGRESS);
  });

  it("should transition to a new phase", () => {
    // Arrange
    const session = PatientCareSession.create(
      { patientId: "patient-id" },
      "session-id"
    ).val;
    const newPhase = {} as CarePhase;

    // Act
    session.transitionToNewPhase(newPhase);

    // Assert
    expect(session.getCurrentPhase()).toBe(newPhase);
    expect(session.getPhaseHistory()).toHaveLength(0);
  });

  it("should complete a session", () => {
    // Arrange
    const session = PatientCareSession.create(
      { patientId: "patient-id" },
      "session-id"
    ).val;

    // Act
    session.completeSession();

    // Assert
    expect(session.getStatus()).toBe(PatientCareSessionStatus.COMPLETED);
    expect(session.getEndDate()).not.toBeNull();
  });

  it("should update the current daily record", () => {
    // Arrange
    const session = PatientCareSession.create(
      { patientId: "patient-id" },
      "session-id"
    ).val;
    const record = {
      getDate: () => DomainDateTime.now().toString(),
    } as DailyCareRecord;

    // Act
    session.updateCurrentDailyRecord(record);

    // Assert
    expect(session.getCurrentDailyRecord()).toBe(record);
  });
});
