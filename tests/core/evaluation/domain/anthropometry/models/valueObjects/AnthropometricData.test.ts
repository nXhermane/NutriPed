import {
  AnthropometricData,
  CreateAnthropometricData,
} from "../../../../../../../core/evaluation/domain/anthropometry/models/valueObjects/AnthropometricData";
import { NegativeValueError } from "../../../../../../../core/shared/exceptions";
import { AnthropometricDataBuilder } from "../../../../../../__helpers__/TestBuilders";

describe("AnthropometricData", () => {
  describe("create", () => {
    it("should create a valid AnthropometricData", () => {
      const props: CreateAnthropometricData = {
        anthropometricMeasures: [
          { code: "WEIGHT", value: 10, unit: "kg" },
          { code: "HEIGHT", value: 100, unit: "cm" },
        ],
      };

      const result = AnthropometricData.create(props);
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBeInstanceOf(AnthropometricData);
      expect(result.val.unpack().entry.length).toBe(2);
      expect(result.val.unpack().entry[0].code.unpack()).toBe("WEIGHT");
      expect(result.val.unpack().entry[0].value).toBe(10);
      expect(result.val.unpack().entry[0].unit.unpack()).toBe("kg");
      expect(result.val.unpack().entry[1].code.unpack()).toBe("HEIGHT");
      expect(result.val.unpack().entry[1].value).toBe(100);
      expect(result.val.unpack().entry[1].unit.unpack()).toBe("cm");
    });

    it("should fail when a measure has a negative value", () => {
      const props: CreateAnthropometricData = {
        anthropometricMeasures: [
          { code: "WEIGHT", value: -10, unit: "kg" },
          { code: "HEIGHT", value: 100, unit: "cm" },
        ],
      };

      const result = AnthropometricData.create(props);
      expect(result.isFailure).toBe(true);
      expect(result.err).toContain(
        "The anthropometric measure value can't be negative"
      );
    });

    // it("should fail when a measure has an invalid code", () => {
    //   const props: CreateAnthropometricData = {
    //     anthropometricMeasures: [
    //       { code: "INVALID_CODE", value: 10, unit: "kg" },
    //       { code: "HEIGHT", value: 100, unit: "cm" },
    //     ],
    //   };

    //   const result = AnthropometricData.create(props);
    //   expect(result.isFailure).toBe(true);
    // });

    // it("should fail when a measure has an invalid unit", () => {
    //   const props: CreateAnthropometricData = {
    //     anthropometricMeasures: [
    //       { code: "WEIGHT", value: 10, unit: "invalid_unit" },
    //       { code: "HEIGHT", value: 100, unit: "cm" },
    //     ],
    //   };

    //   const result = AnthropometricData.create(props);
    //   expect(result.isFailure).toBe(true);
    // });
  });

  describe("validate", () => {
    it("should throw NegativeValueError when a measure has a negative value", () => {
      // We need to bypass the create method to test the validate method directly
      // This is not recommended in normal usage, but necessary for testing
      expect(() => {
        // @ts-ignore - Accessing private constructor for testing
        new AnthropometricData({
          entry: [
            {
              code: { unpack: () => "WEIGHT" },
              value: -10,
              unit: { unpack: () => "kg" },
            },
          ],
        });
      }).toThrow(NegativeValueError);
    });
  });

  describe("Using AnthropometricDataBuilder", () => {
    it("should create a valid AnthropometricData using the builder", () => {
      const anthropometricData = new AnthropometricDataBuilder()
        .withMeasures([
          { code: "WEIGHT", value: 10, unit: "kg" },
          { code: "HEIGHT", value: 100, unit: "cm" },
        ])
        .build();

      expect(anthropometricData).toBeInstanceOf(AnthropometricData);
      expect(anthropometricData.unpack().entry.length).toBe(2);
      expect(anthropometricData.unpack().entry[0].code.unpack()).toBe("WEIGHT");
      expect(anthropometricData.unpack().entry[0].value).toBe(10);
      expect(anthropometricData.unpack().entry[0].unit.unpack()).toBe("kg");
      expect(anthropometricData.unpack().entry[1].code.unpack()).toBe("HEIGHT");
      expect(anthropometricData.unpack().entry[1].value).toBe(100);
      expect(anthropometricData.unpack().entry[1].unit.unpack()).toBe("cm");
    });

    it("should create a valid AnthropometricData using the builder with addMeasure", () => {
      const anthropometricData = new AnthropometricDataBuilder()
        .withMeasures([])
        .addMeasure("WEIGHT", 10, "kg")
        .addMeasure("HEIGHT", 100, "cm")
        .build();

      expect(anthropometricData).toBeInstanceOf(AnthropometricData);
      expect(anthropometricData.unpack().entry.length).toBe(2);
      expect(anthropometricData.unpack().entry[0].code.unpack()).toBe("WEIGHT");
      expect(anthropometricData.unpack().entry[0].value).toBe(10);
      expect(anthropometricData.unpack().entry[0].unit.unpack()).toBe("kg");
      expect(anthropometricData.unpack().entry[1].code.unpack()).toBe("HEIGHT");
      expect(anthropometricData.unpack().entry[1].value).toBe(100);
      expect(anthropometricData.unpack().entry[1].unit.unpack()).toBe("cm");
    });

    it("should create a Result<AnthropometricData> using the builder", () => {
      const result = new AnthropometricDataBuilder()
        .withMeasures([
          { code: "WEIGHT", value: 10, unit: "kg" },
          { code: "HEIGHT", value: 100, unit: "cm" },
        ])
        .buildResult();

      expect(result.isSuccess).toBe(true);
      expect(result.val).toBeInstanceOf(AnthropometricData);
    });
  });
});
