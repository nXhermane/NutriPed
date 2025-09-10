import { TreatmentManager } from "@/core/nutrition_care/domain/next/core/services/helpers/TreatmentManager";
import { GenerateUniqueId, Result } from "@/core/shared";
import { ITreatmentDateManagementService } from "@/core/nutrition_care/domain/next/core/services/interfaces";
import { OnGoingTreatment } from "@/core/nutrition_care/domain/next/core/models";

jest.mock(
  "@/core/nutrition_care/domain/next/core/models/entities/OnGoingTreatment"
);

describe("TreatmentManager", () => {
  let idGenerator: jest.Mocked<GenerateUniqueId>;
  let treatmentDateManagementService: jest.Mocked<ITreatmentDateManagementService>;
  let manager: TreatmentManager;

  beforeEach(() => {
    idGenerator = {
      generate: jest.fn().mockReturnValue({ toValue: () => "id" }),
    };
    treatmentDateManagementService = {
      getTreatmentsDueForDate: jest.fn(),
      updateTreatmentDateAfterExecution: jest.fn(),
      getMonitoringParametersDueForDate: jest.fn(),
      updateMonitoringDateAfterExecution: jest.fn(),
      generateInitialTreatmentDate: jest.fn(),
      generateInitialMonitoringDate: jest.fn(),
      regenerateTreatmentDate: jest.fn(),
    };
    manager = new TreatmentManager(idGenerator, treatmentDateManagementService);
    (OnGoingTreatment.create as jest.Mock).mockReturnValue(
      Result.ok({} as OnGoingTreatment)
    );
  });

  it("should synchronize treatments", () => {
    // Arrange
    const recommendedTreatments = [];
    const currentTreatments = [];

    // Act
    const result = manager.synchronizeTreatments(
      recommendedTreatments,
      currentTreatments
    );

    // Assert
    expect(result.isSuccess).toBe(true);
  });
});
