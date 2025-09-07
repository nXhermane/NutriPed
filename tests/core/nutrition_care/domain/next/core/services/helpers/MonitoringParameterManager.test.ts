import { MonitoringParameterManager } from "@/core/nutrition_care/domain/next/core/services/helpers/MonitoringParameterManager";
import { GenerateUniqueId, Result } from "@/core/shared";
import { ITreatmentDateManagementService } from "@/core/nutrition_care/domain/next/core/services/interfaces";
import { MonitoringParameter } from "@/core/nutrition_care/domain/next/core/models";

jest.mock(
  "@/core/nutrition_care/domain/next/core/models/entities/MonitoringParameter"
);

describe("MonitoringParameterManager", () => {
  let idGenerator: jest.Mocked<GenerateUniqueId>;
  let treatmentDateManagementService: jest.Mocked<ITreatmentDateManagementService>;
  let manager: MonitoringParameterManager;

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
      regenerateMonitoringDate: jest.fn(),
    };
    manager = new MonitoringParameterManager(
      idGenerator,
      treatmentDateManagementService
    );
    (MonitoringParameter.create as jest.Mock).mockReturnValue(
      Result.ok({} as MonitoringParameter)
    );
  });

  it("should synchronize monitoring parameters", () => {
    // Arrange
    const recommendedElements = [];
    const currentParameters = [];

    // Act
    const result = manager.synchronizeMonitoringParameters(
      recommendedElements,
      currentParameters
    );

    // Assert
    expect(result.isSuccess).toBe(true);
  });
});
