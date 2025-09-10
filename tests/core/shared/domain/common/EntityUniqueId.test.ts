import { EntityUniqueID } from "../../../../../core/shared/domain/common/EntityUniqueId";

describe("EntityUniqueId", () => {
  it("should create a new EntityUniqueId with a string value", () => {
    const id = new EntityUniqueID("test-id");
    expect(id.toValue()).toBe("test-id");
  });

  it("should create a new EntityUniqueId with a number value", () => {
    const id = new EntityUniqueID(123);
    expect(id.toValue()).toBe(123);
  });
});
