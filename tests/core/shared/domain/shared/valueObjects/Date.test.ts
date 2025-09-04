import { DomainDate } from "../../../../../../core/shared/domain/shared/valueObjects/Date";
import { DateBuilder } from "../../../../../__helpers__/TestBuilders";
import {
  ArgumentOutOfRangeException,
  InvalidArgumentFormatError,
} from "../../../../../../core/shared/exceptions";

describe("DomainDate", () => {
  describe("constructor", () => {
    it("should create a DomainDate with the current date when no date is provided", () => {
      const domainDate = new DomainDate();
      expect(domainDate).toBeDefined();
      expect(domainDate.toString()).toBeDefined();
    });

    it("should create a DomainDate with the provided date", () => {
      const domainDate = new DomainDate("2023-01-01");
      expect(domainDate).toBeDefined();
      expect(domainDate.toString()).toBe("2023-01-01");
    });
  });

  describe("validate", () => {

    it("should throw InvalidArgumentFormatError when date format is invalid", () => {
      expect(() => {
        new DomainDate("invalid-date");
      }).toThrow(InvalidArgumentFormatError);
    });

    it("should throw ArgumentInvalidException when date parts are not numbers", () => {
      expect(() => {
        new DomainDate("20xx-01-01");
      }).toThrow(InvalidArgumentFormatError);
    });

    it("should throw ArgumentOutOfRangeException when month is invalid", () => {
      expect(() => {
        new DomainDate("2023-13-01");
      }).toThrow(ArgumentOutOfRangeException);
    });

    it("should throw ArgumentOutOfRangeException when day is invalid", () => {
      expect(() => {
        new DomainDate("2023-01-32");
      }).toThrow(ArgumentOutOfRangeException);
    });

    it("should accept valid date in YYYY-MM-DD format", () => {
      const domainDate = new DomainDate("2023-01-01");
      expect(domainDate).toBeDefined();
      expect(domainDate.toString()).toBe("2023-01-01");
    });

    it("should accept valid date in DD/MM/YYYY format", () => {
      const domainDate = new DomainDate("01/01/2023");
      expect(domainDate).toBeDefined();
      expect(domainDate.toString()).toBe("01/01/2023");
    });
  });

  describe("isLeapYear", () => {
    it("should return true for leap years", () => {
      const leapYears = ["2020-01-01", "2024-01-01", "2000-01-01"];
      leapYears.forEach(year => {
        const domainDate = new DomainDate(year);
        expect(domainDate.isLeapYear()).toBe(true);
      });
    });

    it("should return false for non-leap years", () => {
      const nonLeapYears = [
        "2021-01-01",
        "2022-01-01",
        "2023-01-01",
        "2100-01-01",
      ];
      nonLeapYears.forEach(year => {
        const domainDate = new DomainDate(year);
        expect(domainDate.isLeapYear()).toBe(false);
      });
    });
  });

  describe("isDateToday", () => {
    it("should return true if the date is today", () => {
      const today = new Date();
      const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      const domainDate = new DomainDate(formattedToday);
      expect(domainDate.isDateToday()).toBe(true);
    });

    it("should return false if the date is not today", () => {
      const domainDate = new DomainDate("2000-01-01");
      expect(domainDate.isDateToday()).toBe(false);
    });
  });

  describe("isSameDay", () => {
    it("should return true if the dates are the same day", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-01");
      expect(date1.isSameDay(date2)).toBe(true);
    });

    it("should return false if the dates are different days", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-02");
      expect(date1.isSameDay(date2)).toBe(false);
    });
  });

  describe("isBefore", () => {
    it("should return true if the date is before the other date", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-02");
      expect(date1.isBefore(date2)).toBe(true);
    });

    it("should return false if the date is the same as the other date", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-01");
      expect(date1.isBefore(date2)).toBe(false);
    });

    it("should return false if the date is after the other date", () => {
      const date1 = new DomainDate("2023-01-02");
      const date2 = new DomainDate("2023-01-01");
      expect(date1.isBefore(date2)).toBe(false);
    });
  });

  describe("isAfter", () => {
    it("should return true if the date is after the other date", () => {
      const date1 = new DomainDate("2023-01-02");
      const date2 = new DomainDate("2023-01-01");
      expect(date1.isAfter(date2)).toBe(true);
    });

    it("should return false if the date is the same as the other date", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-01");
      expect(date1.isAfter(date2)).toBe(false);
    });

    it("should return false if the date is before the other date", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-02");
      expect(date1.isAfter(date2)).toBe(false);
    });
  });

  describe("diffInDays", () => {
    it("should return the correct difference in days", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-10");
      expect(date1.diffInDays(date2)).toBe(9);
    });

    it("should return the absolute difference in days", () => {
      const date1 = new DomainDate("2023-01-10");
      const date2 = new DomainDate("2023-01-01");
      expect(date1.diffInDays(date2)).toBe(9);
    });

    it("should return 0 for the same day", () => {
      const date1 = new DomainDate("2023-01-01");
      const date2 = new DomainDate("2023-01-01");
      expect(date1.diffInDays(date2)).toBe(0);
    });
  });

  describe("toString", () => {
    it("should return the date as a string", () => {
      const domainDate = new DomainDate("2023-01-01");
      expect(domainDate.toString()).toBe("2023-01-01");
    });
  });

  describe("getDate", () => {
    it("should return the date as a Date object", () => {
      const domainDate = new DomainDate("2023-01-01");
      const date = domainDate.getDate();
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2023);
      expect(date.getMonth()).toBe(0); // January is 0
      expect(date.getDate()).toBe(1);
    });
  });

  describe("create", () => {
    it("should return a success result with a valid date", () => {
      const result = DomainDate.create("2023-01-01");
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBeInstanceOf(DomainDate);
      expect(result.val.toString()).toBe("2023-01-01");
    });

    it("should return a failure result with an invalid date", () => {
      const result = DomainDate.create("invalid-date");
      expect(result.isFailure).toBe(true);
    });

    it("should create a date with the current date when no date is provided", () => {
      const result = DomainDate.create();
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBeInstanceOf(DomainDate);
    });
  });

  describe("Using DateBuilder", () => {
    it("should create a DomainDate using the builder", () => {
      const domainDate = new DateBuilder().withDate("2023-01-01").build();
      expect(domainDate).toBeInstanceOf(DomainDate);
      expect(domainDate.toString()).toBe("2023-01-01");
    });

    it("should create a Result<DomainDate> using the builder", () => {
      const result = new DateBuilder().withDate("2023-01-01").buildResult();
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBeInstanceOf(DomainDate);
      expect(result.val.toString()).toBe("2023-01-01");
    });
  });
});
