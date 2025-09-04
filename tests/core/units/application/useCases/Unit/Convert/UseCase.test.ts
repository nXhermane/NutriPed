import { ConvertUnitUseCase } from "../../../../../../../core/units/application/useCases/Unit/Convert/UseCase";
import {
  IUnitConverterService,
  Unit,
  UnitRepository,
  UnitType,
} from "../../../../../../../core/units/domain";
import { Result } from "../../../../../../../core/shared";

// Mock Unit entities
const kgUnit = Unit.create(
  {
    name: "Kilogram",
    code: "kg",
    conversionFactor: 1000,
    baseUnitCode: "g",
    type: UnitType.MASS,
  },
  "kg-id"
).val;
const gUnit = Unit.create(
  {
    name: "Gram",
    code: "g",
    conversionFactor: 1,
    baseUnitCode: "g",
    type: UnitType.MASS,
  },
  "g-id"
).val;

// Mock UnitRepository
const mockUnitRepository: jest.Mocked<UnitRepository> = {
  getByCode: jest.fn(code => {
    if (code.unpack() === "kg") return Promise.resolve(kgUnit);
    if (code.unpack() === "g") return Promise.resolve(gUnit);
    return Promise.reject(new Error("Not Found"));
  }),
} as any;

// Mock UnitConverterService
const mockConversionService: jest.Mocked<IUnitConverterService> = {
  convert: jest.fn().mockReturnValue(Result.ok(1000)),
  convertToBase: jest.fn().mockReturnValue(1000),
};

describe("ConvertUnitUseCase", () => {
  let useCase: ConvertUnitUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ConvertUnitUseCase(mockUnitRepository, mockConversionService);
  });

  it("should convert between two units successfully", async () => {
    // Act
    const result = await useCase.execute({ value: 1, from: "kg", to: "g" });

    // Assert
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const value = result.value.val;
      expect(value.value).toBe(1000);
      expect(value.code).toBe("g");
    }
    expect(mockUnitRepository.getByCode).toHaveBeenCalledWith(
      expect.objectContaining({ props: { _value: "kg" } })
    );
    expect(mockUnitRepository.getByCode).toHaveBeenCalledWith(
      expect.objectContaining({ props: { _value: "g" } })
    );
    expect(mockConversionService.convert).toHaveBeenCalledWith(
      1,
      kgUnit,
      gUnit
    );
  });

  it("should convert to a base unit successfully", async () => {
    // Act
    const result = await useCase.execute({ value: 1, from: "kg" });

    // Assert
    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      const value = result.value.val;
      expect(value.value).toBe(1000);
      expect(value.code).toBe("g");
    }
    expect(mockUnitRepository.getByCode).toHaveBeenCalledWith(
      expect.objectContaining({ props: { _value: "kg" } })
    );
    expect(mockConversionService.convertToBase).toHaveBeenCalledWith(1, kgUnit);
  });

  it("should return a failure when units are incompatible", async () => {
    // Arrange
    mockConversionService.convert.mockReturnValue(
      Result.fail("Incompatible units")
    );

    // Act
    const result = await useCase.execute({ value: 1, from: "kg", to: "g" });

    // Assert
    expect(result.isLeft()).toBe(true);
  });

  it("should return a failure when a unit is not found", async () => {
    // Act
    const result = await useCase.execute({
      value: 1,
      from: "non-existent",
      to: "g",
    });

    // Assert
    expect(result.isLeft()).toBe(true);
  });
});
