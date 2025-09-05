import { DailyScheduleService } from "@/core/nutrition_care/domain/next/core/services/DailyScheduleService";
import { ITreatmentDateManagementService } from "@/core/nutrition_care/domain/next/core/services/interfaces";
import { OnGoingTreatment } from "@/core/nutrition_care/domain/next/core/models";
import { DomainDateTime, Result } from "@/core/shared";

describe("DailyScheduleService", () => {
    let treatmentDateManagementService: jest.Mocked<ITreatmentDateManagementService>;
    let service: DailyScheduleService;

    beforeEach(() => {
        treatmentDateManagementService = {
            getTreatmentsDueForDate: jest.fn(),
            updateTreatmentDateAfterExecution: jest.fn(),
            getMonitoringParametersDueForDate: jest.fn(),
            updateMonitoringDateAfterExecution: jest.fn(),
            generateInitialTreatmentDate: jest.fn(),
            generateInitialMonitoringDate: jest.fn(),
        };
        service = new DailyScheduleService(treatmentDateManagementService);
    });

    it("should get treatments due for date", () => {
        // Arrange
        const treatments = [] as OnGoingTreatment[];
        const targetDate = DomainDateTime.now();
        treatmentDateManagementService.getTreatmentsDueForDate.mockReturnValue([]);

        // Act
        const result = service.getTreatmentsDueForDate(treatments, targetDate);

        // Assert
        expect(result.isSuccess).toBe(true);
        expect(treatmentDateManagementService.getTreatmentsDueForDate).toHaveBeenCalledWith(treatments, targetDate);
    });
});
