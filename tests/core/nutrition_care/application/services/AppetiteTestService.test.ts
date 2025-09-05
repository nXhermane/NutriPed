import { AppetiteTestAppService, AppetiteTestAppServiceUseCases } from "@/core/nutrition_care/application/services/AppetiteTestService";
import { CreateAppetiteTestRequest, GetAppetiteTestRequest, EvaluateAppetiteRequest } from "@/core/nutrition_care/application/useCases";
import { AppServiceResponse, Message, left, right, Result } from "@shared";

const mockUseCases: jest.Mocked<AppetiteTestAppServiceUseCases> = {
    createUC: {
        execute: jest.fn(),
    },
    getUC: {
        execute: jest.fn(),
    },
    evaluateAppetiteUC: {
        execute: jest.fn(),
    },
};

describe("AppetiteTestAppService", () => {
    const service = new AppetiteTestAppService(mockUseCases);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("create", () => {
        it("should return the id on successful creation", async () => {
            // Arrange
            const request: CreateAppetiteTestRequest = { code: "test", name: "Test" };
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
            const request: CreateAppetiteTestRequest = { code: "test", name: "Test" };
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
        it("should return the appetite test reference on successful retrieval", async () => {
            // Arrange
            const request: GetAppetiteTestRequest = { id: "test-id" };
            const response = { id: "test-id", code: "test", name: "Test" };
            mockUseCases.getUC.execute.mockResolvedValue(right(Result.ok(response)));

            // Act
            const result = await service.get(request);

            // Assert
            expect(result).toEqual({ data: response });
            expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            // Arrange
            const request: GetAppetiteTestRequest = { id: "test-id" };
            const error = { err: "Not found" };
            mockUseCases.getUC.execute.mockResolvedValue(left(error));

            // Act
            const result = await service.get(request);

            // Assert
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
        });
    });

    describe("evaluateAppetite", () => {
        it("should return the appetite test result on successful evaluation", async () => {
            // Arrange
            const request: EvaluateAppetiteRequest = { appetiteTestId: "test-id", patientId: "patient-id" };
            const response = { result: "pass" };
            mockUseCases.evaluateAppetiteUC.execute.mockResolvedValue(right(Result.ok(response as any)));

            // Act
            const result = await service.evaluateAppetite(request);

            // Assert
            expect(result).toEqual({ data: response });
            expect(mockUseCases.evaluateAppetiteUC.execute).toHaveBeenCalledWith(request);
        });

        it("should return an error message on failure", async () => {
            // Arrange
            const request: EvaluateAppetiteRequest = { appetiteTestId: "test-id", patientId: "patient-id" };
            const error = { err: "Evaluation failed" };
            mockUseCases.evaluateAppetiteUC.execute.mockResolvedValue(left(error));

            // Act
            const result = await service.evaluateAppetite(request);

            // Assert
            expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
            expect(mockUseCases.evaluateAppetiteUC.execute).toHaveBeenCalledWith(request);
        });
    });
});
