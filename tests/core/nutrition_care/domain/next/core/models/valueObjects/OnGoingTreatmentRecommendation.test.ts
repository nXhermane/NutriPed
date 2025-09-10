import {
  OnGoingTreatmentRecommendation,
  CreateOnGoingTreatmentRecommendation,
} from "@/core/nutrition_care/domain/next/core/models/valueObjects/OnGoingTreatmentRecommendation";
import {
  RECOMMENDED_TREATMENT_TYPE,
  TREATMENT_PLAN_IDS,
  DURATION_TYPE,
  FREQUENCY_TYPE,
  MEDICINE_CODES,
} from "@/core/constants";
import { Frequency, Duration } from "@/core/nutrition_care/domain/modules";
import { Result } from "@/core/shared";

jest.mock(
  "@/core/nutrition_care/domain/modules/carePhase/models/valueObjects/MonitoringFrequency"
);
jest.mock(
  "@/core/nutrition_care/domain/modules/carePhase/models/valueObjects/TreatmentDuration"
);

describe("OnGoingTreatmentRecommendation", () => {
  beforeEach(() => {
    (Frequency.create as jest.Mock).mockReturnValue(Result.ok({} as Frequency));
    (Duration.create as jest.Mock).mockReturnValue(Result.ok({} as Duration));
  });

  const createProps: CreateOnGoingTreatmentRecommendation = {
    id: "rec-id",
    recommendationCode: TREATMENT_PLAN_IDS.CNT_PHASE1_AMOXICILLIN,
    type: RECOMMENDED_TREATMENT_TYPE.SYSTEMATIC,
    code: MEDICINE_CODES.AMOX,
    duration: {
      type: DURATION_TYPE.DAYS,
      value: 7,
    },
    frequency: {
      intervalUnit: FREQUENCY_TYPE.DAILY,
      intervalValue: 1,
      countInUnit: 2,
    },
  };

  it("should create a new on-going treatment recommendation", () => {
    // Act
    const result = OnGoingTreatmentRecommendation.create(createProps);

    // Assert
    expect(result.isSuccess).toBe(true);
  });
});
