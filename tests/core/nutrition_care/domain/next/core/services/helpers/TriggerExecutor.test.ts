import { TriggerExecutor } from "@/core/nutrition_care/domain/next/core/services/helpers/TriggerExecutor";
import { GenerateUniqueId, Result } from "@/core/shared";
import { IRecommendedTreatmentService } from "@/core/nutrition_care/domain/modules";
import {
  CarePhase,
  OnGoingTreatment,
} from "@/core/nutrition_care/domain/next/core/models";

jest.mock(
  "@/core/nutrition_care/domain/next/core/models/entities/OnGoingTreatment"
);
jest.mock("@/core/nutrition_care/domain/next/core/models/entities/CarePhase");

describe("TriggerExecutor", () => {
  let recommendedTreatmentService: jest.Mocked<IRecommendedTreatmentService>;
  let idGenerator: jest.Mocked<GenerateUniqueId>;
  let executor: TriggerExecutor;

  beforeEach(() => {
    recommendedTreatmentService = {
      getByRecommendationCode: jest.fn(),
    };
    idGenerator = {
      generate: jest.fn().mockReturnValue({ toValue: () => "id" }),
    };
    executor = new TriggerExecutor(recommendedTreatmentService, idGenerator);
  });

  it("should execute all triggers", async () => {
    // Arrange
    const newTreatments = [];
    const stoppedTreatments = [];
    const recommendedTreatments = [];
    const carePhase = {} as any;

    // Act
    const result = await executor.executeAllTriggers(
      newTreatments,
      stoppedTreatments,
      recommendedTreatments,
      carePhase
    );

    // Assert
    expect(result.isSuccess).toBe(true);
  });
});
