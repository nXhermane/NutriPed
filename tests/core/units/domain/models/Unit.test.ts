import {
  Unit,
  CreateUnitProps,
} from "@/core/units/domain/models/aggregates/Unit";
import { UnitType } from "@/core/units/domain/models/constants";
import { UnitCreatedEvent } from "@/core/units/domain/events";
import { EmptyStringError, Result, SystemCode } from "@/core/shared";

describe("Unit Domain Entity", () => {
  const validProps: CreateUnitProps = {
    name: "Kilogram",
    code: "kg",
    conversionFactor: 1,
    baseUnitCode: "kg",
    type: UnitType.MASS,
  };
  const id = "test-id";

  // Test 1: Happy Path
  it("should create a Unit successfully with valid properties", () => {
    const unitResult = Unit.create(validProps, id);

    expect(unitResult.isSuccess).toBe(true);
    const unit = unitResult.val;
    expect(unit).toBeInstanceOf(Unit);
    expect(unit.id).toBe(id);
    expect(unit.getName()).toBe("Kilogram");
    expect(unit.getCode()).toBe("kg");
  });

  // Test 2: Failure Path
  it("should return a failure Result if created with an invalid code", () => {
    const invalidProps = { ...validProps, code: "" }; // Empty code
    const unitResult = Unit.create(invalidProps, id);

    expect(unitResult.isFailure).toBe(true);
    expect(unitResult.error).toBeDefined();
  });

  // Test 3: Invariant Check
  it("should throw an EmptyStringError when changing the name to an empty string", () => {
    const unit = Unit.create(validProps, id).val;

    expect(() => {
      unit.changeName("");
    }).toThrow(EmptyStringError);
  });

  // Test 4: Domain Event Check
  it("should dispatch a UnitCreatedEvent upon successful creation", () => {
    const unit = Unit.create(validProps, id).val;
    const domainEvents = unit.getDomainEvents();
    const event = domainEvents.find(e => e instanceof UnitCreatedEvent);

    expect(domainEvents.length).toBe(1);
    expect(event).toBeInstanceOf(UnitCreatedEvent);
    expect((event as UnitCreatedEvent).aggregate.id).toBe(id);
  });
});
