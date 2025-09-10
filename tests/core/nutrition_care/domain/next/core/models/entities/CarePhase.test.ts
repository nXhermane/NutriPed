import {
  CarePhase,
  CreateCarePhase,
  CarePhaseStatus,
} from "@/core/nutrition_care/domain/next/core/models/entities/CarePhase";
import { CARE_PHASE_CODES } from "@/core/constants";
import { MonitoringParameter } from "@/core/nutrition_care/domain/next/core/models/entities/MonitoringParameter";
import { OnGoingTreatment } from "@/core/nutrition_care/domain/next/core/models/entities/OnGoingTreatment";
import { Result } from "@/core/shared";

jest.mock(
  "@/core/nutrition_care/domain/next/core/models/entities/MonitoringParameter"
);
jest.mock(
  "@/core/nutrition_care/domain/next/core/models/entities/OnGoingTreatment"
);

describe("CarePhase", () => {
  beforeEach(() => {
    (MonitoringParameter.create as jest.Mock).mockReturnValue(
      Result.ok({} as MonitoringParameter)
    );
    (OnGoingTreatment.create as jest.Mock).mockReturnValue(
      Result.ok({} as OnGoingTreatment)
    );
  });

  const createProps: CreateCarePhase = {
    code: CARE_PHASE_CODES.CNT_PHASE1,
    monitoringParameters: [],
    onGoingTreatments: [],
  };

  it("should create a new care phase", () => {
    // Act
    const result = CarePhase.create(createProps, "phase-id");

    // Assert
    expect(result.isSuccess).toBe(true);
    const carePhase = result.val;
    expect(carePhase.id).toBe("phase-id");
    expect(carePhase.getStatus()).toBe(CarePhaseStatus.IN_PROGRESS);
  });

  it("should fail the care phase", () => {
    // Arrange
    const carePhase = CarePhase.create(createProps, "phase-id").val;

    // Act
    carePhase.carePhaseFailed();

    // Assert
    expect(carePhase.getStatus()).toBe(CarePhaseStatus.FAILED);
    expect(carePhase.getEndDate()).not.toBeNull();
  });

  it("should succeed the care phase", () => {
    // Arrange
    const carePhase = CarePhase.create(createProps, "phase-id").val;

    // Act
    carePhase.carePhaseSucceed();

    // Assert
    expect(carePhase.getStatus()).toBe(CarePhaseStatus.SUCCEED);
    expect(carePhase.getEndDate()).not.toBeNull();
  });
});
