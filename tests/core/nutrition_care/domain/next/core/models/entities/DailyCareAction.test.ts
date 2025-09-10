import {
  DailyCareAction,
  DailyCareActionType,
  DailyCareActionStatus,
  CreateDailyCareAction,
} from "@/core/nutrition_care/domain/next/core/models/entities/DailyCareAction";
import {
  MilkType,
  DosageFormulaUnit,
  FeedingFrequenciePerDay,
} from "@/core/constants";

describe("DailyCareAction", () => {
  const createProps: CreateDailyCareAction = {
    treatmentId: "treatment-id",
    type: DailyCareActionType.NUTRITIONAL_ACTION,
    action: {
      productType: MilkType.F75,
      calcultedQuantity: {
        minValue: 100,
        maxValue: 200,
        unit: DosageFormulaUnit.ML,
      },
      recommendedQuantity: {
        values: { [FeedingFrequenciePerDay.EIGHT]: 150 },
        unit: DosageFormulaUnit.ML,
      },
      feedingFrequencies: [FeedingFrequenciePerDay.EIGHT],
    },
    effectiveDate: new Date().toISOString(),
  };

  it("should create a new daily care action", () => {
    // Act
    const result = DailyCareAction.create(createProps, "action-id");

    // Assert
    expect(result.isSuccess).toBe(true);
    const action = result.val;
    expect(action.id).toBe("action-id");
    expect(action.getStatus()).toBe(DailyCareActionStatus.IN_WAITING);
  });

  it("should complete the action", () => {
    // Arrange
    const action = DailyCareAction.create(createProps, "action-id").val;
    (action as any).checkIsEffective = jest.fn().mockReturnValue(true);

    // Act
    action.completed();

    // Assert
    expect(action.getStatus()).toBe(DailyCareActionStatus.COMPLETED);
  });
});
