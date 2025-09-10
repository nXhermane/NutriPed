import {
  OnGoingTreatment,
  CreateOnGoindTreatment,
  OnGoingTreatmentStatus,
} from "@/core/nutrition_care/domain/next/core/models/entities/OnGoingTreatment";
import { OnGoingTreatmentRecommendation } from "@/core/nutrition_care/domain/next/core/models/valueObjects";
import { TREATMENT_PLAN_IDS } from "@/core/constants";
import { Result } from "@/core/shared";

jest.mock(
  "@/core/nutrition_care/domain/next/core/models/valueObjects/OnGoingTreatmentRecommendation"
);

describe("OnGoingTreatment", () => {
  beforeEach(() => {
    (OnGoingTreatmentRecommendation.create as jest.Mock).mockReturnValue(
      Result.ok({} as OnGoingTreatmentRecommendation)
    );
  });

  const createProps: CreateOnGoindTreatment = {
    code: TREATMENT_PLAN_IDS.CNT_PHASE1_AMOXICILLIN,
    recommendation: {} as any,
    endDate: null,
    nextActionDate: null,
  };

  it("should create a new on-going treatment", () => {
    // Act
    const result = OnGoingTreatment.create(createProps, "treatment-id");

    // Assert
    expect(result.isSuccess).toBe(true);
    const treatment = result.val;
    expect(treatment.id).toBe("treatment-id");
    expect(treatment.getStatus()).toBe(OnGoingTreatmentStatus.ACTIVE);
  });

  it("should complete the treatment", () => {
    // Arrange
    const treatment = OnGoingTreatment.create(createProps, "treatment-id").val;

    // Act
    treatment.completedTreatment();

    // Assert
    expect(treatment.getStatus()).toBe(OnGoingTreatmentStatus.COMPLETED);
    expect(treatment.getEndDate()).not.toBeNull();
  });
});
