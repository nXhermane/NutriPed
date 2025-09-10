import {
  ComplicationAppService,
  ComplicationServiceUseCases,
} from "@/core/nutrition_care/application/services/ComplicationService";
import {
  CreateComplicationRequest,
  GetComplicationRequest,
} from "@/core/nutrition_care/application/useCases";
import { AppServiceResponse, Message, left, right, Result } from "@shared";

const mockUseCases: jest.Mocked<ComplicationServiceUseCases> = {
  createUC: {
    execute: jest.fn(),
  },
  getUC: {
    execute: jest.fn(),
  },
};

describe("ComplicationAppService", () => {
  const service = new ComplicationAppService(mockUseCases);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return the id on successful creation", async () => {
      // Arrange
      const request: CreateComplicationRequest = { code: "test", name: "Test" };
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
      const request: CreateComplicationRequest = { code: "test", name: "Test" };
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
    it("should return the complication on successful retrieval", async () => {
      // Arrange
      const request: GetComplicationRequest = { type: "test" };
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
      const request: GetComplicationRequest = { type: "test" };
      const error = { err: "Not found" };
      mockUseCases.getUC.execute.mockResolvedValue(left(error));

      // Act
      const result = await service.get(request);

      // Assert
      expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
      expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
    });
  });
});
