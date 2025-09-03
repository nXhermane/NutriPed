import { ValueObject } from "../../../../../core/shared/domain/common/ValueObject";

interface TestProps {
  foo: string;
  bar: number;
}

class TestValueObject extends ValueObject<TestProps> {
  constructor(props: TestProps) {
    super(props);
  }

  public validate(props: TestProps): void {
    // no validation
  }
}

describe("ValueObject", () => {
  it("should be equal if they have the same props", () => {
    const vo1 = new TestValueObject({ foo: "hello", bar: 123 });
    const vo2 = new TestValueObject({ foo: "hello", bar: 123 });
    expect(vo1.equals(vo2)).toBe(true);
  });

  it("should not be equal if they have different props", () => {
    const vo1 = new TestValueObject({ foo: "hello", bar: 123 });
    const vo2 = new TestValueObject({ foo: "world", bar: 456 });
    expect(vo1.equals(vo2)).toBe(false);
  });

  it("should not be equal to null", () => {
    const vo1 = new TestValueObject({ foo: "hello", bar: 123 });
    expect(vo1.equals(null as any)).toBe(false);
  });

  it("should not be equal to undefined", () => {
    const vo1 = new TestValueObject({ foo: "hello", bar: 123 });
    expect(vo1.equals(undefined as any)).toBe(false);
  });
});
