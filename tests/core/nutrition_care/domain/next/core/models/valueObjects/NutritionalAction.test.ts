import { NutritionalAction, CreateNutritionalAction } from "@/core/nutrition_care/domain/next/core/models/valueObjects/NutritionalAction";
import { MilkType, DosageFormulaUnit, FeedingFrequenciePerDay } from "@/core/constants";

describe("NutritionalAction", () => {
    const createProps: CreateNutritionalAction = {
        productType: MilkType.F75,
        calcultedQuantity: { minValue: 100, maxValue: 200, unit: DosageFormulaUnit.ML },
        recommendedQuantity: { values: { [FeedingFrequenciePerDay.EIGHT]: 150 }, unit: DosageFormulaUnit.ML },
        feedingFrequencies: [FeedingFrequenciePerDay.EIGHT],
    };

    it("should create a new nutritional action", () => {
        // Act
        const result = NutritionalAction.create(createProps);

        // Assert
        expect(result.isSuccess).toBe(true);
    });
});
