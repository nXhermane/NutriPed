import { DailyTaskGeneratorService } from "@/core/nutrition_care/domain/next/core/services/DailyTaskGeneratorService";
import { GenerateUniqueId, Result } from "@/core/shared";
import { MonitoringParameter, DailyMonitoringTask } from "@/core/nutrition_care/domain/next/core/models";
import { MONITORING_ELEMENT_CATEGORY, MONITORING_VALUE_SOURCE } from "@/core/constants";

jest.mock("@/core/nutrition_care/domain/next/core/models/entities/DailyMonitoringTask");

describe("DailyTaskGeneratorService", () => {
    let idGenerator: jest.Mocked<GenerateUniqueId>;
    let service: DailyTaskGeneratorService;

    beforeEach(() => {
        idGenerator = {
            generate: jest.fn().mockReturnValue({ toValue: () => "id" }),
        };
        service = new DailyTaskGeneratorService(idGenerator);
        (DailyMonitoringTask.create as jest.Mock).mockReturnValue(Result.ok({} as DailyMonitoringTask));
    });

    it("should generate daily tasks", async () => {
        // Arrange
        const parameter = {
            getProps: () => ({
                element: {
                    getSource: () => MONITORING_VALUE_SOURCE.MANUAL,
                    getCategory: () => MONITORING_ELEMENT_CATEGORY.ANTHROPOMETRIC,
                    getCode: () => "weight",
                },
            }),
        } as any;

        // Act
        const result = await service.generate(parameter, [], {});

        // Assert
        expect(result.isSuccess).toBe(true);
    });
});
