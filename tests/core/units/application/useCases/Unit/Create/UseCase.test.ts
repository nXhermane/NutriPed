import { CreateUnitUseCase } from "../../../../../../../core/units/application/useCases/Unit/Create/UseCase";
import {
  EntityUniqueID,
  GenerateUniqueId,
  Result,
} from "../../../../../../../core/shared";
import {
  Unit,
  UnitRepository,
  UnitType,
} from "../../../../../../../core/units/domain";
import { CreateUnitRequest } from "../../../../../../../core/units/application/useCases/Unit/Create/Request";

// Mock GenerateUniqueId
const mockIdGenerator: GenerateUniqueId = {
  generate: () => new EntityUniqueID("mock-id"),
};

// Mock UnitRepository
const mockUnitRepository: jest.Mocked<UnitRepository> = {
  exist: jest.fn(),
  save: jest.fn(),
  getByCode: jest.fn(),
  getAll: jest.fn(),
  remove: jest.fn(),
  getById: jest.fn(),
  delete: jest.fn(),
};

describe("CreateUnitUseCase", () => {
  let useCase: CreateUnitUseCase;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    useCase = new CreateUnitUseCase(mockIdGenerator, mockUnitRepository);
  });

  const validRequest: CreateUnitRequest = {
    data: {
      name: "Kilogram",
      code: "kg",
      conversionFactor: 1000,
      baseUnitCode: "g",
      type: UnitType.WEIGHT,
    },
  };

  it("should create and save a new unit successfully", async () => {
    // Arrange
    mockUnitRepository.exist.mockResolvedValue(false);

    // Act
    const result = await useCase.execute(validRequest);

    // Assert
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const value = result.value.val;
      expect(value.id).toBe("mock-id");
    }
    expect(mockUnitRepository.exist).toHaveBeenCalledTimes(1);
    expect(mockUnitRepository.save).toHaveBeenCalledTimes(1);
    expect(mockUnitRepository.save).toHaveBeenCalledWith(expect.any(Unit));
  });

  it("should return a failure when the unit code already exists", async () => {
    // Arrange
    mockUnitRepository.exist.mockResolvedValue(true);

    // Act
    const result = await useCase.execute(validRequest);

    // Assert
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      expect((error as any).err).toBe("The unit with code already exist.");
    }
    expect(mockUnitRepository.exist).toHaveBeenCalledTimes(1);
    expect(mockUnitRepository.save).not.toHaveBeenCalled();
  });

  it("should return a failure when the provided data is invalid", async () => {
    // Arrange
    const invalidRequest: CreateUnitRequest = {
      data: {
        ...validRequest.data,
        code: "", // Invalid code
      },
    };

    // Act
    const result = await useCase.execute(invalidRequest);

    // Assert
    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      const error = result.value;
      // This error comes from the SystemCode value object
      expect(error).toBeInstanceOf(Result);
    }
    expect(mockUnitRepository.exist).not.toHaveBeenCalled();
    expect(mockUnitRepository.save).not.toHaveBeenCalled();
  });
});
