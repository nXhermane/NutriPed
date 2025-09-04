import { FullName } from "../../../../../../core/shared/domain/shared/valueObjects/FullName";

describe("FullName", () => {
  it("should create a valid full name", () => {
    const fullName = FullName.create("John Doe");
    expect(fullName.isSuccess).toBe(true);
    expect(fullName.val.fullName).toBe("John Doe");
  });

  it("should return the correct first name", () => {
    const fullName = FullName.create("John Doe").val;
    expect(fullName.firstName).toBe("John");
  });

  it("should return the correct last name", () => {
    const fullName = FullName.create("John Doe").val;
    expect(fullName.lastName).toBe("Doe");
  });

  it("should fail to create an empty full name", () => {
    const fullName = FullName.create("");
    expect(fullName.isFailure).toBe(true);
  });
});
