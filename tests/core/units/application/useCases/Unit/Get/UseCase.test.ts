import { GetUnitUseCase } from "../../../../../../../core/units/application/useCases/Unit/Get/UseCase";
import {
  Unit,
  UnitRepository,
  UnitType,
} from "../../../../../../../core/units/domain";
import { ApplicationMapper } from "../../../../../../../core/shared";
import { UnitDto } from "../../../../../../../core/units/application/dtos";

// Mock Unit entity
const mockUnit = Unit.create(
  {
    name: "Kilogram",
    code: "kg",
    conversionFactor: 1000,
    baseUnitCode: "g",
    type: UnitType.WEIGHT,
  },
  "test-id"
).val;

// Mock UnitRepository
const mockUnitRepository: jest.Mocked<UnitRepository> = {
  getById: jest.fn().mockResolvedValue(mockUnit),
  getByCode: jest.fn().mockResolvedValue(mockUnit),
  getAll: jest.fn().mockResolvedValue([mockUnit]),
  exist: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
};

// Mock UnitMapper
const mockMapper: jest.Mocked<ApplicationMapper<Unit, UnitDto>> = {
  toResponse: jest.fn(unit => ({
    id: unit.id,
    name: unit.getName(),
    code: unit.getCode(),
    baseUnitCode: unit.getBaseUnit(),
    conversionFactor: unit.getFactor(),
    type: unit.getType(),
    createdAt: unit.createdAt,
    updatedAt: unit.updatedAt,
  })),
};

describe("GetUnitUseCase", () => {
  let useCase: GetUnitUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetUnitUseCase(mockUnitRepository, mockMapper);
  });

  it("should get a unit by ID successfully", async () => {
    // Act
    const result = await useCase.execute({ id: "test-id" });

    // Assert
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const value = result.value.val;
      expect(value).toHaveLength(1);
      expect(value[0].id).toBe("test-id");
    }
    expect(mockUnitRepository.getById).toHaveBeenCalledWith("test-id");
    expect(mockMapper.toResponse).toHaveBeenCalled();
  });

  it("should get a unit by code successfully", async () => {
    // Act
    const result = await useCase.execute({ code: "kg" });

    // Assert
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const value = result.value.val;
      expect(value).toHaveLength(1);
      expect(value[0].code).toBe("kg");
    }
    expect(mockUnitRepository.getByCode).toHaveBeenCalled();
    expect(mockMapper.toResponse).toHaveBeenCalled();
  });

  it("should get all units successfully", async () => {
    // Act
    const result = await useCase.execute({});

    // Assert
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const value = result.value.val;
      expect(value).toHaveLength(1);
    }
    expect(mockUnitRepository.getAll).toHaveBeenCalledWith(undefined);
    expect(mockMapper.toResponse).toHaveBeenCalled();
  });

  it("should get units by type successfully", async () => {
    // Act
    await useCase.execute({ type: UnitType.WEIGHT });

    // Assert
    expect(mockUnitRepository.getAll).toHaveBeenCalledWith(UnitType.WEIGHT);
  });
});
