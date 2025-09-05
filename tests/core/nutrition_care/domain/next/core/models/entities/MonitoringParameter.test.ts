import { MonitoringParameter, CreateMonitoringParameter } from "@/core/nutrition_care/domain/next/core/models/entities/MonitoringParameter";
import { MonitoringParameterElement } from "@/core/nutrition_care/domain/next/core/models/valueObjects";
import { Result } from "@/core/shared";

jest.mock("@/core/nutrition_care/domain/next/core/models/valueObjects");

describe("MonitoringParameter", () => {
    beforeEach(() => {
        (MonitoringParameterElement.create as jest.Mock).mockReturnValue(Result.ok({} as MonitoringParameterElement));
    });

    const createProps: CreateMonitoringParameter = {
        element: {} as any,
        endDate: null,
        nextTaskDate: null,
    };

    it("should create a new monitoring parameter", () => {
        // Act
        const result = MonitoringParameter.create(createProps, "param-id");

        // Assert
        expect(result.isSuccess).toBe(true);
        const param = result.val;
        expect(param.id).toBe("param-id");
    });
});
