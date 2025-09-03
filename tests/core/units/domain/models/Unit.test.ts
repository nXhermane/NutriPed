import { Unit, CreateUnitProps } from "../../../../../core/units/domain/models/aggregates/Unit";
import { SystemCode, Result, AggregateID, EmptyStringError } from "../../../../../core/shared";
import { UnitCreatedEvent } from "../../../../../core/units/domain/events";
import { UnitType } from "../../../../../core/units/domain/models/constants";

describe("Unit", () => {
  const validProps: CreateUnitProps = {
    name: "Kilogram",
    code: "kg",
    conversionFactor: 1,
    baseUnitCode: "kg",
    type: UnitType.MASS,
  };

  const id: AggregateID = "test-id";

  it("should create a unit successfully with valid properties", () => {
    const result = Unit.create(validProps, id);
    expect(result.isSuccess).toBe(true);
    const unit = result.val;
    expect(unit.getName()).toBe("Kilogram");
    expect(unit.getCode()).toBe("kg");
    expect(unit.getType()).toBe(UnitType.MASS);
  });

  it("should return a failure result if an invalid code is provided", () => {
    const invalidProps = { ...validProps, code: "" };
    const result = Unit.create(invalidProps, id);
    expect(result.isFailure).toBe(true);
  });

  it("should throw an EmptyStringError when changing the name to an empty string", () => {
    const result = Unit.create(validProps, id);
    const unit = result.val;
    expect(() => unit.changeName("")).toThrow(EmptyStringError);
  });

});
