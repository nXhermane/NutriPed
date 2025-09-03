import { Email } from "../../../../../../core/shared/domain/shared/valueObjects/Email";

describe("Email", () => {
  it("should create a valid email", () => {
    const email = Email.create("test@example.com");
    expect(email.isSuccess).toBe(true);
    expect(email.val.toString()).toBe("test@example.com");
  });

  it("should fail to create an invalid email", () => {
    const email = Email.create("invalid-email");
    expect(email.isFailure).toBe(true);
  });
});
