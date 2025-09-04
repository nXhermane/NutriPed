import { UnitConverterService } from "../../../../../core/units/domain/services/UnitConverterService";
import { Unit } from "../../../../../core/units/domain/models";
import { UnitType } from "../../../../../core/units/domain/models/constants";

describe("UnitConverterService", () => {
  let unitConverterService: UnitConverterService;

  const gramResult = Unit.create(
    {
      name: "Gram",
      code: "g",
      conversionFactor: 1,
      baseUnitCode: "g",
      type: UnitType.MASS,
    },
    "g-id"
  );
  const kilogramResult = Unit.create(
    {
      name: "Kilogram",
      code: "kg",
      conversionFactor: 1000,
      baseUnitCode: "g",
      type: UnitType.MASS,
    },
    "kg-id"
  );
  const meterResult = Unit.create(
    {
      name: "Meter",
      code: "m",
      conversionFactor: 1,
      baseUnitCode: "m",
      type: UnitType.LENGTH,
    },
    "m-id"
  );

  if (
    gramResult.isFailure ||
    kilogramResult.isFailure ||
    meterResult.isFailure
  ) {
    throw new Error("Failed to create mock units for testing");
  }

  const gram = gramResult.val;
  const kilogram = kilogramResult.val;
  const meter = meterResult.val;

  beforeEach(() => {
    unitConverterService = new UnitConverterService();
  });

  it("should correctly convert a value between two compatible units", () => {
    const value = 1; // 1 kg
    const result = unitConverterService.convert(value, kilogram, gram);
    expect(result.isSuccess).toBe(true);
    expect(result.val).toBe(1000);
  });

  it("should return a failure result when converting between incompatible units", () => {
    const value = 1; // 1 kg
    const result = unitConverterService.convert(value, kilogram, meter);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe(
      "It's not possible to convert a unit with different base unit."
    );
  });

  it("should correctly convert a value to its base unit", () => {
    const value = 2.5; // 2.5 kg
    const result = unitConverterService.convertToBase(value, kilogram);
    expect(result).toBe(2500);
  });
});
