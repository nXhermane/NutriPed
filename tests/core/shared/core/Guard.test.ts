import { Guard } from "../../../../core/shared/core/Guard";

describe("Guard", () => {
  describe("isEmpty", () => {
    it("should return succeeded=true for null values", () => {
      const result = Guard.isEmpty(null);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for undefined values", () => {
      const result = Guard.isEmpty(undefined);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for empty strings", () => {
      const result = Guard.isEmpty("");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for strings with only whitespace", () => {
      const result = Guard.isEmpty("   ");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for empty objects", () => {
      const result = Guard.isEmpty({});
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for empty arrays", () => {
      const result = Guard.isEmpty([]);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for arrays with only empty values", () => {
      const result = Guard.isEmpty(["", null, undefined]);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false for non-empty strings", () => {
      const result = Guard.isEmpty("test");
      expect(result.succeeded).toBe(false);
    });

    it("should return succeeded=false for non-empty objects", () => {
      const result = Guard.isEmpty({ test: "value" });
      expect(result.succeeded).toBe(false);
    });

    it("should return succeeded=false for non-empty arrays", () => {
      const result = Guard.isEmpty(["test"]);
      expect(result.succeeded).toBe(false);
    });

    it("should return succeeded=false for numbers", () => {
      const result = Guard.isEmpty(0);
      expect(result.succeeded).toBe(false);
    });

    it("should return succeeded=false for booleans", () => {
      const result = Guard.isEmpty(false);
      expect(result.succeeded).toBe(false);
    });

    it("should return succeeded=false for Date objects", () => {
      const result = Guard.isEmpty(new Date());
      expect(result.succeeded).toBe(false);
    });
  });

  describe("isNegative", () => {
    it("should return succeeded=true for negative numbers", () => {
      const result = Guard.isNegative(-1);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false for zero", () => {
      const result = Guard.isNegative(0);
      expect(result.succeeded).toBe(false);
    });

    it("should return succeeded=false for positive numbers", () => {
      const result = Guard.isNegative(1);
      expect(result.succeeded).toBe(false);
    });
  });

  describe("combine", () => {
    it("should return the first failure result when combining results with at least one failure", () => {
      const result1 = { succeeded: true };
      const result2 = { succeeded: false, message: "error2" };
      const result3 = { succeeded: true };

      const combinedResult = Guard.combine([result1, result2, result3]);
      expect(combinedResult.succeeded).toBe(false);
      expect(combinedResult.message).toBe("error2");
    });

    it("should return a success result when combining only success results", () => {
      const result1 = { succeeded: true };
      const result2 = { succeeded: true };
      const result3 = { succeeded: true };

      const combinedResult = Guard.combine([result1, result2, result3]);
      expect(combinedResult.succeeded).toBe(true);
    });
  });

  describe("againstNullOrUndefined", () => {
    it("should return succeeded=false for null values", () => {
      const result = Guard.againstNullOrUndefined(null, "test");
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("test is null or undefined");
    });

    it("should return succeeded=false for undefined values", () => {
      const result = Guard.againstNullOrUndefined(undefined, "test");
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("test is null or undefined");
    });

    it("should return succeeded=true for non-null and non-undefined values", () => {
      const result = Guard.againstNullOrUndefined("value", "test");
      expect(result.succeeded).toBe(true);
    });
  });

  describe("againstNullOrUndefinedBulk", () => {
    it("should return succeeded=false if any argument is null or undefined", () => {
      const args = [
        { argument: "value1", argumentName: "arg1" },
        { argument: null, argumentName: "arg2" },
        { argument: "value3", argumentName: "arg3" },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("arg2 is null or undefined");
    });

    it("should return succeeded=true if all arguments are non-null and non-undefined", () => {
      const args = [
        { argument: "value1", argumentName: "arg1" },
        { argument: 0, argumentName: "arg2" },
        { argument: false, argumentName: "arg3" },
      ];
      const result = Guard.againstNullOrUndefinedBulk(args);
      expect(result.succeeded).toBe(true);
    });
  });

  describe("isOneOf", () => {
    it("should return succeeded=true if the value is one of the valid values", () => {
      const result = Guard.isOneOf("test", ["test", "value"], "arg");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false if the value is not one of the valid values", () => {
      const result = Guard.isOneOf("invalid", ["test", "value"], "arg");
      expect(result.succeeded).toBe(false);
      expect(result.message).toContain("arg isn't oneOf the correct types");
    });
  });

  describe("inRange", () => {
    it("should return succeeded=true if the number is within the range", () => {
      const result = Guard.inRange(5, 0, 10, "arg");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true if the number is equal to the min value", () => {
      const result = Guard.inRange(0, 0, 10, "arg");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true if the number is equal to the max value", () => {
      const result = Guard.inRange(10, 0, 10, "arg");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false if the number is less than the min value", () => {
      const result = Guard.inRange(-1, 0, 10, "arg");
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("arg is not within range 0 to 10.");
    });

    it("should return succeeded=false if the number is greater than the max value", () => {
      const result = Guard.inRange(11, 0, 10, "arg");
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("arg is not within range 0 to 10.");
    });
  });

  describe("allInRange", () => {
    it("should return succeeded=true if all numbers are within the range", () => {
      const result = Guard.allInRange([1, 5, 9], 0, 10, "arg");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false if any number is outside the range", () => {
      const result = Guard.allInRange([1, 5, 11], 0, 10, "arg");
      expect(result.succeeded).toBe(false);
      expect(result.message).toBe("arg is not within the range.");
    });
  });

  describe("isString", () => {
    it("should return succeeded=true for strings", () => {
      const result = Guard.isString("test");
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false for non-strings", () => {
      expect(Guard.isString(123).succeeded).toBe(false);
      expect(Guard.isString(true).succeeded).toBe(false);
      expect(Guard.isString({}).succeeded).toBe(false);
      expect(Guard.isString([]).succeeded).toBe(false);
      expect(Guard.isString(null).succeeded).toBe(false);
      expect(Guard.isString(undefined).succeeded).toBe(false);
    });
  });

  describe("isNumber", () => {
    it("should return succeeded=true for numbers", () => {
      const result = Guard.isNumber(123);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false for non-numbers", () => {
      expect(Guard.isNumber("test").succeeded).toBe(false);
      expect(Guard.isNumber(true).succeeded).toBe(false);
      expect(Guard.isNumber({}).succeeded).toBe(false);
      expect(Guard.isNumber([]).succeeded).toBe(false);
      expect(Guard.isNumber(null).succeeded).toBe(false);
      expect(Guard.isNumber(undefined).succeeded).toBe(false);
    });
  });

  describe("isObject", () => {
    it("should return succeeded=true for objects", () => {
      const result = Guard.isObject({});
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for arrays (which are objects in JavaScript)", () => {
      const result = Guard.isObject([]);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=true for null (which is an object in JavaScript)", () => {
      const result = Guard.isObject(null);
      expect(result.succeeded).toBe(true);
    });

    it("should return succeeded=false for non-objects", () => {
      expect(Guard.isObject("test").succeeded).toBe(false);
      expect(Guard.isObject(123).succeeded).toBe(false);
      expect(Guard.isObject(true).succeeded).toBe(false);
      expect(Guard.isObject(undefined).succeeded).toBe(false);
    });
  });
});
