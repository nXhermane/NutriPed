import { DailyCareRecord, CreateDailyCareRecord } from "@/core/nutrition_care/domain/next/core/models/entities/DailyCareRecord";
import { DailyCareAction } from "@/core/nutrition_care/domain/next/core/models/entities/DailyCareAction";
import { DailyMonitoringTask } from "@/core/nutrition_care/domain/next/core/models/entities/DailyMonitoringTask";
import { DateManager, Result } from "@/core/shared";

jest.mock("@/core/nutrition_care/domain/next/core/models/entities/DailyCareAction");
jest.mock("@/core/nutrition_care/domain/next/core/models/entities/DailyMonitoringTask");

describe("DailyCareRecord", () => {
    beforeEach(() => {
        (DailyCareAction.create as jest.Mock).mockReturnValue(Result.ok({ isCompleted: () => true } as DailyCareAction));
        (DailyMonitoringTask.create as jest.Mock).mockReturnValue(Result.ok({ isCompleted: () => true } as DailyMonitoringTask));
    });

    const createProps: CreateDailyCareRecord = {
        date: new Date().toISOString(),
        treatmentActions: [],
        monitoringTasks: [],
    };

    it("should create a new daily care record", () => {
        // Act
        const result = DailyCareRecord.create(createProps, "record-id");

        // Assert
        expect(result.isSuccess).toBe(true);
        const record = result.val;
        expect(record.id).toBe("record-id");
    });

    it("should be completed if all actions and tasks are completed", () => {
        // Arrange
        const record = DailyCareRecord.create(createProps, "record-id").val;

        // Act
        const isCompleted = record.isCompleted();

        // Assert
        expect(isCompleted).toBe(true);
    });

    it("should not be completed if some actions are not completed", () => {
        // Arrange
        (DailyCareAction.create as jest.Mock).mockReturnValue(Result.ok({ isCompleted: () => false } as DailyCareAction));
        const record = DailyCareRecord.create({ ...createProps, treatmentActions: [{} as any] }, "record-id").val;

        // Act
        const isCompleted = record.isCompleted();

        // Assert
        expect(isCompleted).toBe(false);
    });
});
