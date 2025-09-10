import {
  ValueObject,
  DomainPrimitive,
} from "../../../../../core/shared/domain/common/ValueObject";
import { ArgumentNotProvidedException } from "../../../../../core/shared/exceptions";

// Création d'une classe de value object concrète pour les tests
class TestValueObject extends ValueObject<string> {
  protected validate(props: Readonly<DomainPrimitive<string>>): void {
    if (props._value.length < 3) {
      throw new Error("Value must be at least 3 characters long");
    }
  }
}

// Création d'une classe de value object complexe pour les tests
interface ComplexValueProps {
  name: string;
  value: number;
}

class ComplexValueObject extends ValueObject<ComplexValueProps> {
  protected validate(props: Readonly<ComplexValueProps>): void {
    if (props.name.length < 3) {
      throw new Error("Name must be at least 3 characters long");
    }
    if (props.value < 0) {
      throw new Error("Value must be non-negative");
    }
  }

  get name(): string {
    return this.props.name;
  }

  get value(): number {
    return this.props.value;
  }
}

describe("ValueObject", () => {
  describe("constructor", () => {
    it("should create a valid primitive value object", () => {
      const valueObject = new TestValueObject({ _value: "test" });
      expect(valueObject).toBeDefined();
      expect(valueObject.unpack()).toBe("test");
    });

    it("should create a valid complex value object", () => {
      const valueObject = new ComplexValueObject({ name: "test", value: 10 });
      expect(valueObject).toBeDefined();
      expect(valueObject.name).toBe("test");
      expect(valueObject.value).toBe(10);
    });

    it("should throw an error when primitive value is invalid", () => {
      expect(() => {
        new TestValueObject({ _value: "ab" });
      }).toThrow("Value must be at least 3 characters long");
    });

    it("should throw an error when complex value is invalid", () => {
      expect(() => {
        new ComplexValueObject({ name: "ab", value: 10 });
      }).toThrow("Name must be at least 3 characters long");

      expect(() => {
        new ComplexValueObject({ name: "test", value: -1 });
      }).toThrow("Value must be non-negative");
    });

    it("should throw an error when props is empty", () => {
      expect(() => {
        // @ts-ignore - Testing invalid input
        new TestValueObject({});
      }).toThrow(ArgumentNotProvidedException);
    });

    it("should throw an error when primitive value is empty", () => {
      expect(() => {
        new TestValueObject({ _value: "" });
      }).toThrow(ArgumentNotProvidedException);
    });

    it("should freeze the props", () => {
      const valueObject = new TestValueObject({ _value: "test" });
      expect(Object.isFrozen(valueObject.props)).toBe(true);
    });
  });

  describe("isValueObject", () => {
    it("should return true for a value object", () => {
      const valueObject = new TestValueObject({ _value: "test" });
      expect(ValueObject.isValueObject(valueObject)).toBe(true);
    });

    it("should return false for a non-value object", () => {
      expect(ValueObject.isValueObject({})).toBe(false);
      expect(ValueObject.isValueObject(null)).toBe(false);
      expect(ValueObject.isValueObject(undefined)).toBe(false);
      expect(ValueObject.isValueObject("string")).toBe(false);
      expect(ValueObject.isValueObject(123)).toBe(false);
    });
  });

  describe("equals", () => {
    it("should return true for value objects with the same primitive value", () => {
      const valueObject1 = new TestValueObject({ _value: "test" });
      const valueObject2 = new TestValueObject({ _value: "test" });
      expect(valueObject1.equals(valueObject2)).toBe(true);
    });

    it("should return false for value objects with different primitive values", () => {
      const valueObject1 = new TestValueObject({ _value: "test1" });
      const valueObject2 = new TestValueObject({ _value: "test2" });
      expect(valueObject1.equals(valueObject2)).toBe(false);
    });

    it("should return true for value objects with the same complex value", () => {
      const valueObject1 = new ComplexValueObject({ name: "test", value: 10 });
      const valueObject2 = new ComplexValueObject({ name: "test", value: 10 });
      expect(valueObject1.equals(valueObject2)).toBe(true);
    });

    it("should return false for value objects with different complex values", () => {
      const valueObject1 = new ComplexValueObject({ name: "test1", value: 10 });
      const valueObject2 = new ComplexValueObject({ name: "test2", value: 10 });
      expect(valueObject1.equals(valueObject2)).toBe(false);

      const valueObject3 = new ComplexValueObject({ name: "test", value: 10 });
      const valueObject4 = new ComplexValueObject({ name: "test", value: 20 });
      expect(valueObject3.equals(valueObject4)).toBe(false);
    });

    it("should return false for null or undefined", () => {
      const valueObject = new TestValueObject({ _value: "test" });
      expect(valueObject.equals(null as any)).toBe(false);
      expect(valueObject.equals(undefined as any)).toBe(false);
    });
  });

  describe("unpack", () => {
    it("should return the primitive value", () => {
      const valueObject = new TestValueObject({ _value: "test" });
      expect(valueObject.unpack()).toBe("test");
    });

    it("should return the complex value", () => {
      const valueObject = new ComplexValueObject({ name: "test", value: 10 });
      const unpacked = valueObject.unpack();
      expect(unpacked).toEqual({ name: "test", value: 10 });
    });
  });

  describe("isValid", () => {
    it("should return true for valid value objects", () => {
      const valueObject = new TestValueObject({ _value: "test" });
      expect(valueObject.isValid()).toBe(true);
    });

    it("should return false when validation fails", () => {
      const valueObject = new TestValueObject({ _value: "test" });

      // Mock the validate method to throw an error
      jest.spyOn(valueObject as any, "validate").mockImplementation(() => {
        throw new Error("Validation error");
      });

      expect(valueObject.isValid()).toBe(false);
    });
  });
});
