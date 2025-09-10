import {
  MonitoringTask,
  CreateMonitoringTask,
  MonitoringTaskCategory,
} from "@/core/nutrition_care/domain/next/core/models/valueObjects/MonitoringTask";

describe("MonitoringTask", () => {
  const createProps: CreateMonitoringTask = {
    category: MonitoringTaskCategory.ANTHROP,
    code: "weight",
  };

  it("should create a new monitoring task", () => {
    // Act
    const result = MonitoringTask.create(createProps);

    // Assert
    expect(result.isSuccess).toBe(true);
  });
});
