import { NutritionalTreatmentAction } from "@/core/nutrition_care/domain/core/models/valueObjects/NutritionalTreatmentAction";
import { MilkType } from "@/core/nutrition_care/domain/modules";

describe("NutritionalTreatmentAction", () => {
  it("should create a new nutritional treatment action", () => {
    // Arrange
    const props = {
      milkType: MilkType.F75,
      milkVolume: 100,
      milkVolumeUnit: "ml",
      feedingFrequency: 8,
    };

    // Act
    const result = NutritionalTreatmentAction.create(props);

    // Assert
    expect(result.isSuccess).toBe(true);
  });

  it("should return a failure result if the milk volume is negative", () => {
    // Arrange
    const props = {
      milkType: MilkType.F75,
      milkVolume: -100,
      milkVolumeUnit: "ml",
      feedingFrequency: 8,
    };

    // Act
    const result = NutritionalTreatmentAction.create(props);

    // Assert
    expect(result.isFailure).toBe(true);
  });

  it("should return a failure result if the feeding frequency is negative", () => {
    // Arrange
    const props = {
      milkType: MilkType.F75,
      milkVolume: 100,
      milkVolumeUnit: "ml",
      feedingFrequency: -8,
    };

    // Act
    const result = NutritionalTreatmentAction.create(props);

    // Assert
    expect(result.isFailure).toBe(true);
  });
});
