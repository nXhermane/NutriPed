import {
  MedicalAction,
  CreateMedicalAction,
} from "@/core/nutrition_care/domain/next/core/models/valueObjects/MedicalAction";
import { NextNutritionCare } from "@/core/nutrition_care/domain/modules";
import { Result } from "@/core/shared";

jest.mock(
  "@/core/nutrition_care/domain/modules/next/medicines/models/valueObjects/DosageRange"
);

describe("MedicalAction", () => {
  beforeEach(() => {
    (NextNutritionCare.DosageRange.create as jest.Mock).mockReturnValue(
      Result.ok({} as any)
    );
  });

  const createProps: CreateMedicalAction = {
    dailyDosage: {} as any,
    dailyFrequency: 1,
    dosage: {} as any,
  };

  it("should create a new medical action", () => {
    // Act
    const result = MedicalAction.create(createProps);

    // Assert
    expect(result.isSuccess).toBe(true);
  });
});
