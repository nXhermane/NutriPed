import { Entity } from "../../../../../core/shared/domain/common/Entity";
import { EntityUniqueID } from "../../../../../core/shared/domain/common/EntityUniqueId";

interface TestProps {
  foo: string;
}

class TestEntity extends Entity<TestProps> {
  private constructor(props: TestProps, id?: EntityUniqueID) {
    super({props, id: id ? id.toValue(): new EntityUniqueID('test-id').toValue()});
  }

  public static create(props: TestProps, id?: EntityUniqueID): TestEntity {
    return new TestEntity(props, id);
  }

  public validate(): void {
    // no validation
  }
}

describe("Entity", () => {
  it("should be equal if they have the same id", () => {
    const id = new EntityUniqueID('test-id');
    const entity1 = TestEntity.create({ foo: "bar" }, id);
    const entity2 = TestEntity.create({ foo: "baz" }, id);
    expect(entity1.equals(entity2)).toBe(true);
  });

  it("should not be equal if they have different ids", () => {
    const entity1 = TestEntity.create({ foo: "bar" }, new EntityUniqueID('id-1'));
    const entity2 = TestEntity.create({ foo: "baz" }, new EntityUniqueID('id-2'));
    expect(entity1.equals(entity2)).toBe(false);
  });

  it("should not be equal to null", () => {
    const entity1 = TestEntity.create({ foo: "bar" });
    expect(entity1.equals(null as any)).toBe(false);
  });

  it("should not be equal to undefined", () => {
    const entity1 = TestEntity.create({ foo: "bar" });
    expect(entity1.equals(undefined as any)).toBe(false);
  });
});
