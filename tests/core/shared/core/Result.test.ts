import { Result } from "../../../../core/shared/core/Result";

describe("Result", () => {
  describe("ok", () => {
    it("should create a successful result", () => {
      const result = Result.ok<string>("success");
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.val).toBe("success");
    });
  });

  describe("fail", () => {
    it("should create a failed result", () => {
      const result = Result.fail<string>("error");
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.err).toBe("error");
    });
  });

  describe("getValue", () => {
    it("should return the value of a successful result", () => {
      const result = Result.ok<string>("success");
      expect(result.val).toBe("success");
    });

    it("should throw an error for a failed result", () => {
      const result = Result.fail<string>("error");
      expect(() => result.val).toThrow();
    });
  });

  describe("errorValue", () => {
    it("should return the error of a failed result", () => {
      const result = Result.fail<string>("error");
      expect(result.err).toBe("error");
    });
  });

  describe("combine", () => {
    it("should return a successful result if all results are successful", () => {
      const results = [Result.ok<string>("one"), Result.ok<string>("two")];
      const combined = Result.combine(results as any);
      expect(combined.isSuccess).toBe(true);
    });

    it("should return a failed result if one result is a failure", () => {
      const results = [Result.ok<string>("one"), Result.fail<string>("error")];
      const combined = Result.combine(results as any);
      expect(combined.isFailure).toBe(true);
      expect(combined.err).toBe("error");
    });
  });
});
