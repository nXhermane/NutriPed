import { MonitoringEntry, MonitoringEntryType, MonitoredValueSource } from "@/core/nutrition_care/domain/core/models/valueObjects/MonitoringEntry";
import { DateManager } from "@shared";

describe("MonitoringEntry", () => {
    const today = DateManager.formatDate(new Date());

    it("should create a new monitoring entry", () => {
        // Arrange
        const props = {
            date: today,
            type: MonitoringEntryType.ANTHROPOMETRIC,
            code: "weight",
            value: 10,
            unit: "kg",
            source: MonitoredValueSource.MANUAL,
        };

        // Act
        const result = MonitoringEntry.create(props);

        // Assert
        expect(result.isSuccess).toBe(true);
    });

    it("should return a failure result if the value is negative", () => {
        // Arrange
        const props = {
            date: today,
            type: MonitoringEntryType.ANTHROPOMETRIC,
            code: "weight",
            value: -10,
            unit: "kg",
            source: MonitoredValueSource.MANUAL,
        };

        // Act
        const result = MonitoringEntry.create(props);

        // Assert
        expect(result.isFailure).toBe(true);
    });
});
