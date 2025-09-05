import { MedicineAppService, MedicineServiceUseCases } from "@/core/nutrition_care/application/services/MedicineService";
import { CreateMedicineRequest, GetMedicineRequest, GetMedicineDosageRequest } from "@/core/nutrition_care/application/useCases";
import { AppServiceResponse, Message, left, right, Result } from "@shared";

const mockUseCases: jest.Mocked<MedicineServiceUseCases> = {
    createUC: {
        execute: jest.fn(),
    },
    getUC: {
        execute: jest.fn(),
    },
    getDosageUC: {
        execute: jest.fn(),
    },
};

describe("MedicineAppService", () => {
    const service = new MedicineAppService(mockUseCases);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should return the id on successful creation", async () => {
            // Arrange
            const request: CreateMedicineRequest = { code: "test", name: "Test" };
            const response = { id: "test-id" };
            mockUseCases.createUC.execute.mockResolvedValue(right(Result.ok(response)));

            // Act
            const result = await service.create(request);

            // Assert
            expect(result).toEqual({ data: response });
            expect(mockUseCases.createUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            // Arrange
            const request: CreateMedicineRequest = { code: "test", name: "Test" };
            const error = { err: "Creation failed" };
            mockUseCases.createUC.execute.mockResolvedValue(left(error));

            // Act
            const result = await service.create(request);

            // Assert
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.createUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("get", () => {
        it("should return the medicine on successful retrieval", async () => {
            // Arrange
            const request: GetMedicineRequest = { type: "test" };
            const response = [{ id: "test-id", code: "test", name: "Test" }];
            mockUseCases.getUC.execute.mockResolvedValue(right(Result.ok(response)));

            // Act
            const result = await service.get(request);

            // Assert
            expect(result).toEqual({ data: response });
            expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            // Arrange
            const request: GetMedicineRequest = { type: "test" };
            const error = { err: "Not found" };
            mockUseCases.getUC.execute.mockResolvedValue(left(error));

            // Act
            const result = await service.get(request);

            // Assert
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("getDosage", () => {
        it("should return the medicine dosage on successful retrieval", async () => {
            // Arrange
            const request: GetMedicineDosageRequest = { medicineId: "test-id", patientId: "patient-id" };
            const response = { dosage: "10ml" };
            mockUseCases.getDosageUC.execute.mockResolvedValue(right(Result.ok(response as any)));

            // Act
            const result = await service.getDosage(request);

            // Assert
            expect(result).toEqual({ data: response });
            expect(mockUseCases.getDosageUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            // Arrange
            const request: GetMedicineDosageRequest = { medicineId: "test-id", patientId: "patient-id" };
            const error = { err: "Not found" };
            mockUseCases.getDosageUC.execute.mockResolvedValue(left(error));

            // Act
            const result = await service.getDosage(request);

            // Assert
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.getDosageUC.execute).toHaveBeenCalledWith(request);
        });
    });
});
