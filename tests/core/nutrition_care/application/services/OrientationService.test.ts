import {
  OrientationAppService,
  OrientationServiceUseCases,
} from "@/core/nutrition_care/application/services/OrientationService";
import {
  CreateOrientationRefRequest,
  GetOrientationRefRequest,
  OrientRequest,
} from "@/core/nutrition_care/application/useCases";
import { AppServiceResponse, Message, left, right, Result } from "@shared";

const mockUseCases: jest.Mocked<OrientationServiceUseCases> = {
  createUC: {
    execute: jest.fn(),
  },
  getUC: {
    execute: jest.fn(),
  },
  orientUC: {
    execute: jest.fn(),
  },
};

describe("OrientationAppService", () => {
  const service = new OrientationAppService(mockUseCases);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("should return the id on successful creation", async () => {
      // Arrange
      const request: CreateOrientationRefRequest = {
        code: "test",
        name: "Test",
      };
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
      const request: CreateOrientationRefRequest = {
        code: "test",
        name: "Test",
      };
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
    it("should return the orientation on successful retrieval", async () => {
      // Arrange
      const request: GetOrientationRefRequest = { type: "test" };
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
      const request: GetOrientationRefRequest = { type: "test" };
      const error = { err: "Not found" };
      mockUseCases.getUC.execute.mockResolvedValue(left(error));

      // Act
      const result = await service.get(request);

      // Assert
      expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
      expect(mockUseCases.getUC.execute).toHaveBeenCalledWith(request);
    });
  });

  describe("orient", () => {
    it("should return the orientation result on successful retrieval", async () => {
      // Arrange
      const request: OrientRequest = { patientId: "patient-id" };
      const response = { orientation: "test-orientation" };
      mockUseCases.orientUC.execute.mockResolvedValue(
        right(Result.ok(response as any))
      );

      // Act
      const result = await service.orient(request);

      // Assert
      expect(result).toEqual({ data: response });
      expect(mockUseCases.orientUC.execute).toHaveBeenCalledWith(request);
    });

    it("should return an error message on failure", async () => {
      // Arrange
      const request: OrientRequest = { patientId: "patient-id" };
      const error = { err: "Not found" };
      mockUseCases.orientUC.execute.mockResolvedValue(left(error));

      // Act
      const result = await service.orient(request);

      // Assert
      expect(result).toEqual(new Message("error", JSON.stringify(error.err)));
      expect(mockUseCases.orientUC.execute).toHaveBeenCalledWith(request);
    });
  });
});
