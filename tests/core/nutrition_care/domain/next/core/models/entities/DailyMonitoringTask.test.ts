import { DailyMonitoringTask, CreateDailyMonitoringTask, DailyMonitoringTaskStatus } from "@/core/nutrition_care/domain/next/core/models/entities/DailyMonitoringTask";
import { MonitoringTaskCategory } from "@/core/nutrition_care/domain/next/core/models/valueObjects/MonitoringTask";

describe("DailyMonitoringTask", () => {
    const createProps: CreateDailyMonitoringTask = {
        monitoringId: "monitoring-id",
        task: {
            category: MonitoringTaskCategory.ANTHROP,
            code: "weight",
        },
    };

    it("should create a new daily monitoring task", () => {
        // Act
        const result = DailyMonitoringTask.create(createProps, "task-id");

        // Assert
        expect(result.isSuccess).toBe(true);
        const task = result.val;
        expect(task.id).toBe("task-id");
        expect(task.getStatus()).toBe(DailyMonitoringTaskStatus.IN_WAITING);
    });

    it("should complete the task", () => {
        // Arrange
        const task = DailyMonitoringTask.create(createProps, "task-id").val;

        // Act
        task.completed();

        // Assert
        expect(task.getStatus()).toBe(DailyMonitoringTaskStatus.COMPLETED);
    });
});
