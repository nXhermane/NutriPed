import { Guard } from "../../../../core/shared/core/Guard";

describe("Guard", () => {
  describe("againstNullOrUndefined", () => {
    it("should return succeeded: false for null", () => {
      const result = Guard.againstNullOrUndefined(null, "test");
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("test is null or undefined");
    });

    it("should return succeeded: false for undefined", () => {
      const result = Guard.againstNullOrUndefined(undefined, "test");
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("test is null or undefined");
    });

    it("should return succeeded: true for a valid value", () => {
      const result = Guard.againstNullOrUndefined("hello", "test");
      expect(result.succeeded).toBe(true);
    });
  });

  describe("againstNullOrUndefinedBulk", () => {
    it("should return succeeded: false if one argument is null", () => {
      const args = [
        { argument: "hello", argumentName: "arg1" },
        { argument: null, argumentName: "arg2" },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("arg2 is null or undefined");
    });

    it("should return succeeded: true if all arguments are valid", () => {
      const args = [
        { argument: "hello", argumentName: "arg1" },
        { argument: 123, argumentName: "arg2" },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);
      expect(result.succeeded).toBe(true);
    });
  });
});
