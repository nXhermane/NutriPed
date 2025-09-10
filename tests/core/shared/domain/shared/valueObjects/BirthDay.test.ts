import { Birthday } from "../../../../../../core/shared/domain/shared/valueObjects/BirthDay";

describe("Birthday", () => {
  it("should create a valid birthday", () => {
    const birthday = Birthday.create("2000-01-01");
    expect(birthday.isSuccess).toBe(true);
    expect(birthday.val.toString()).toBe("2000-01-01");
  });

  it("should calculate the correct age", () => {
    const birthday = Birthday.create("2000-01-01").val;
    const expectedAge = new Date().getFullYear() - 2000;
    expect(birthday.getAge()).toBe(expectedAge);
  });
});
