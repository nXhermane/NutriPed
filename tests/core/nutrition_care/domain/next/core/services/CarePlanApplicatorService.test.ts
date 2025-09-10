import { CarePlanApplicatorService } from "@/core/nutrition_care/domain/next/core/services/CarePlanApplicatorService";
import {
  ITreatmentManager,
  IMonitoringParameterManager,
  ITriggerExecutor,
} from "@/core/nutrition_care/domain/next/core/services/helpers";
import { CarePlanRecommendation } from "@/core/nutrition_care/domain/modules";
import { CarePhase } from "@/core/nutrition_care/domain/next/core/models";
import { Result } from "@/core/shared";

describe("CarePlanApplicatorService", () => {
  let treatmentManager: jest.Mocked<ITreatmentManager>;
  let monitoringParameterManager: jest.Mocked<IMonitoringParameterManager>;
  let triggerExecutor: jest.Mocked<ITriggerExecutor>;
  let service: CarePlanApplicatorService;

  beforeEach(() => {
    treatmentManager = {
      synchronizeTreatments: jest.fn(),
      applyTreatmentTransitions: jest.fn(),
    };
    monitoringParameterManager = {
      synchronizeMonitoringParameters: jest.fn(),
      applyMonitoringParameterTransitions: jest.fn(),
    };
    triggerExecutor = {
      executeAllTriggers: jest.fn(),
    };
    service = new CarePlanApplicatorService(
      treatmentManager,
      monitoringParameterManager,
      triggerExecutor
    );
  });

  it("should apply a care plan", async () => {
    // Arrange
    const recommendation = {
      applicableTreatments: [],
      monitoringElements: [],
    } as any;
    const targetCarePhase = {
      getProps: () => ({ onGoingTreatments: [], monitoringParameters: [] }),
    } as any;
    treatmentManager.synchronizeTreatments.mockReturnValue(
      Result.ok({ newTreatments: [], stoppedTreatments: [] }) as any
    );
    monitoringParameterManager.synchronizeMonitoringParameters.mockReturnValue(
      Result.ok({}) as any
    );
    triggerExecutor.executeAllTriggers.mockResolvedValue(
      Result.ok({
        executedTriggers: { onStart: 0, onEnd: 0 },
        errors: [],
      }) as any
    );

    // Act
    const result = await service.applyPlan(recommendation, targetCarePhase);

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(treatmentManager.synchronizeTreatments).toHaveBeenCalled();
    expect(
      monitoringParameterManager.synchronizeMonitoringParameters
    ).toHaveBeenCalled();
    expect(triggerExecutor.executeAllTriggers).toHaveBeenCalled();
  });
});
