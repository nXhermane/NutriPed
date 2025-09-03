import { AggregateID, Result, SystemCode } from "@shared";
import { Unit, CreateUnitProps, UnitType } from "../../../../../../core/units/domain/models";
import { UnitCreatedEvent, UnitDeletedEvent } from "../../../../../../core/units/domain/events";

describe("Unit Domain Entity", () => {
  // Test data
  const validUnitProps: CreateUnitProps = {
    name: "Kilogram",
    code: "kg",
    conversionFactor: 1,
    baseUnitCode: "kg",
    type: UnitType.WEIGHT,
  };

  const validUnitId: AggregateID = "unit-123";

  describe("Unit.create", () => {
    it("should create a valid Unit entity", () => {
      // Act
      const unitResult = Unit.create(validUnitProps, validUnitId);

      // Assert
      expect(unitResult.isSuccess).toBe(true);
      expect(unitResult.val).toBeInstanceOf(Unit);
      expect(unitResult.val.getName()).toBe(validUnitProps.name);
      expect(unitResult.val.getCode()).toBe(validUnitProps.code);
      expect(unitResult.val.getBaseUnit()).toBe(validUnitProps.baseUnitCode);
      expect(unitResult.val.getFactor()).toBe(validUnitProps.conversionFactor);
      expect(unitResult.val.getType()).toBe(validUnitProps.type);
      expect(unitResult.val.id).toBe(validUnitId);
    });

    it("should fail when creating a Unit with empty name", () => {
      // Arrange
      const invalidProps: CreateUnitProps = {
        ...validUnitProps,
        name: "",
      };

      // Act
      const unitResult = Unit.create(invalidProps, validUnitId);
      
      // Assert
      expect(unitResult.isSuccess).toBe(false);
      expect(unitResult.val).toBeNull();
      expect(unitResult.error).toBeDefined();
    });

    it("should fail when creating a Unit with empty code", () => {
      // Arrange
      const invalidProps: CreateUnitProps = {
        ...validUnitProps,
        code: "",
      };

      // Act
      const unitResult = Unit.create(invalidProps, validUnitId);
      
      // Assert
      expect(unitResult.isSuccess).toBe(false);
      expect(unitResult.val).toBeNull();
      expect(unitResult.error).toBeDefined();
    });

    it("should fail when creating a Unit with empty baseUnitCode", () => {
      // Arrange
      const invalidProps: CreateUnitProps = {
        ...validUnitProps,
        baseUnitCode: "",
      };

      // Act
      const unitResult = Unit.create(invalidProps, validUnitId);
      
      // Assert
      expect(unitResult.isSuccess).toBe(false);
      expect(unitResult.val).toBeNull();
      expect(unitResult.error).toBeDefined();
    });
  });

  describe("Unit methods", () => {
    let unit: Unit;

    beforeEach(() => {
      const unitResult = Unit.create(validUnitProps, validUnitId);
      unit = unitResult.val;
    });

    it("should change name correctly", () => {
      // Arrange
      const newName = "Gram";
      
      // Act
      unit.changeName(newName);
      
      // Assert
      expect(unit.getName()).toBe(newName);
    });

    it("should throw error when changing to empty name", () => {
      // Act & Assert
      expect(() => unit.changeName("")).toThrow();
    });

    it("should change code correctly", () => {
      // Arrange
      const newCode = "g";
      const systemCodeResult = SystemCode.create(newCode);
      
      // Act
      unit.changeCode(systemCodeResult.val);
      
      // Assert
      expect(unit.getCode()).toBe(newCode);
    });

    it("should change base unit and factor correctly", () => {
      // Arrange
      const newBaseUnit = "g";
      const newFactor = 1000;
      const systemCodeResult = SystemCode.create(newBaseUnit);
      
      // Act
      unit.changeBaseUnitAndFactor({
        baseUnit: systemCodeResult.val,
        factor: newFactor
      });
      
      // Assert
      expect(unit.getBaseUnit()).toBe(newBaseUnit);
      expect(unit.getFactor()).toBe(newFactor);
    });

    it("should change type correctly", () => {
      // Arrange
      const newType = UnitType.VOLUME;
      
      // Act
      unit.changeType(newType);
      
      // Assert
      expect(unit.getType()).toBe(newType);
    });
  });

  describe("Domain events", () => {
    it("should add UnitCreatedEvent when created", () => {
      // Arrange
      const unitResult = Unit.create(validUnitProps, validUnitId);
      const unit = unitResult.val;
      
      // Act
      unit.created();
      const events = unit.getDomainEvents();
      
      // Assert
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(UnitCreatedEvent);
      
      const createdEvent = events[0] as UnitCreatedEvent;
      expect(createdEvent.data.id).toBe(validUnitId);
      expect(createdEvent.data.name).toBe(validUnitProps.name);
      expect(createdEvent.data.code).toBe(validUnitProps.code);
      expect(createdEvent.data.baseUnit).toBe(validUnitProps.baseUnitCode);
      expect(createdEvent.data.factor).toBe(validUnitProps.conversionFactor);
    });

    it("should add UnitDeletedEvent when deleted", () => {
      // Arrange
      const unitResult = Unit.create(validUnitProps, validUnitId);
      const unit = unitResult.val;
      
      // Act
      unit.delete();
      const events = unit.getDomainEvents();
      
      // Assert
      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(UnitDeletedEvent);
      
      const deletedEvent = events[0] as UnitDeletedEvent;
      expect(deletedEvent.data.id).toBe(validUnitId);
      expect(deletedEvent.data.code).toBe(validUnitProps.code);
      expect(unit.isDeleted).toBe(true);
    });

    it("should clear domain events", () => {
      // Arrange
      const unitResult = Unit.create(validUnitProps, validUnitId);
      const unit = unitResult.val;
      unit.created();
      
      // Act
      unit.clearDomainEvent();
      const events = unit.getDomainEvents();
      
      // Assert
      expect(events.length).toBe(0);
    });
  });

  describe("Entity validation", () => {
    it("should be valid when all properties are valid", () => {
      // Arrange
      const unitResult = Unit.create(validUnitProps, validUnitId);
      const unit = unitResult.val;
      
      // Act & Assert
      expect(unit.isValid()).toBe(true);
    });

    it("should be invalid after setting empty name", () => {
      // Arrange
      const unitResult = Unit.create(validUnitProps, validUnitId);
      const unit = unitResult.val;
      
      // Act & Assert
      expect(() => {
        // @ts-ignore - Accessing private property for testing
        unit.props.name = "";
        unit.validate();
      }).toThrow();
    });
  });
});

