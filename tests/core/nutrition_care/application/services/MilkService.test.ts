import {
  MilkAppService,
  MilkServiceUseCases,
} from "@/core/nutrition_care/application/services/MilkService";
import {
  CreateMilkRequest,
  GetMilkRequest,
  SuggestMilkRequest,
} from "@/core/nutrition_care/application/useCases";
import { AppServiceResponse, Message, left, right, Result } from "@shared";

const mockUseCases: jest.Mocked<MilkServiceUseCases> = {
  createUC: {
    execute: jest.fn(),
  },
  getUC: {
    execute: jest.fn(),
  },
  suggestMilkUC: {
    execute: jest.fn(),
  },
};

describe("MilkAppService", () => {
  const service = new MilkAppService(mockUseCases);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return the id on successful creation", async () => {
      // Arrange
      const request: CreateMilkRequest = { code: "test", name: "Test" };
      const response = { id: "test-id" };
      mockUseCases.createUC.execute.mockResolvedValue(
        right(Result.ok(response))
      );

      // Act
      const result = await service.create(request);

      // Assert
      expect(result).toEqual({ data: response });
      expect(mockUseCases.createUC.execute).toHaveBeenCalledWith(request);
    });

    it("should return an error message on failure", async () => {
      // Arrange
      const request: CreateMilkRequest = { code: "test", name: "Test" };
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
    it("should return the milk on successful retrieval", async () => {
      // Arrange
      const request: GetMilkRequest = { type: "test" };
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
      const request: GetMilkRequest = { type: "test" };
      const error = { err: "Not found" };
      mockUseCases.getUC.execute.mockResolvedValue(left(error));

      // Act
      const result = await service.get(request);

      // Assert
      expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
      expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
    });
  });

  describe("suggestMilk", () => {
    it("should return the milk suggestion on successful retrieval", async () => {
      // Arrange
      const request: SuggestMilkRequest = { patientId: "patient-id" };
      const response = { suggestion: "test-milk" };
      mockUseCases.suggestMilkUC.execute.mockResolvedValue(
        right(Result.ok(response as any))
      );

      // Act
      const result = await service.suggestMilk(request);

      // Assert
      expect(result).toEqual({ data: response });
      expect(mockUseCases.suggestMilkUC.execute).toHaveBeenCalledWith(request);
    });

    it("should return an error message on failure", async () => {
      // Arrange
      const request: SuggestMilkRequest = { patientId: "patient-id" };
      const error = { err: "Not found" };
      mockUseCases.suggestMilkUC.execute.mockResolvedValue(left(error));

      // Act
      const result = await service.suggestMilk(request);

      // Assert
      expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
      expect(mockUseCases.suggestMilkUC.execute).toHaveBeenCalledWith(request);
    });
  });
});
