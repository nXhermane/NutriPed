import { DomainPrimitive, ValueObject } from "./../../common/ValueObject";
import { Guard, Result } from "./../../../core";
import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  handleError,
  InvalidArgumentFormatError,
} from "./../../../exceptions";
import { DateManager } from "./../../../utils";

export class DomainDate extends ValueObject<string> {
  constructor(date?: string) {
    if (Guard.isEmpty(date).succeeded) {
      const actDate = new Date();
      super({ _value: DateManager.formatDate(actDate) });
    } else {
      super({ _value: date as string });
    }
  }

  protected validate(props: Readonly<DomainPrimitive<string>>): void {
    if (Guard.isEmpty(props._value).succeeded) {
      throw new ArgumentNotProvidedException("The date must be empty.");
    }

    const dateFormatsRegex = [
      /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
      /^\d{2}\/\d{2}\/\d{4}$/, // DD/MM/YYYY
      /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    ];

    let validFormat = false;
    for (const regex of dateFormatsRegex) {
      if (regex.test(props._value)) {
        validFormat = true;
        break;
      }
    }

    if (!validFormat) {
      throw new InvalidArgumentFormatError(
        "Invalid date format. Use the format YYYY-MM-DD, DD/MM/YYYY or MM/DD/YYYY."
      );
    }

    const parts = props._value.split(/[/-]/);
    let year, month, day;

    if (parts[0].length === 4) {
      year = parseInt(parts[0]);
      month = parseInt(parts[1]);
      day = parseInt(parts[2]);
    } else if (parts[2].length === 4) {
      year = parseInt(parts[2]);
      month = parseInt(parts[0]);
      day = parseInt(parts[1]);
    } else {
      throw new InvalidArgumentFormatError(
        "Invalid date format. You must use this format for year YYYY."
      );
    }
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new ArgumentInvalidException("Invalid date.");
    }

    if (month < 1 || month > 12) {
      throw new ArgumentOutOfRangeException(
        "Month of invalid date. Use a value between 1 and 12."
      );
    }

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) {
      throw new ArgumentOutOfRangeException(
        "Invalid day in month. Use a valid day in a month."
      );
    }
  }

  public isLeapYear(): boolean {
    const year = parseInt(this.props._value.substring(0, 4));
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  public isDateToday(): boolean {
    const today = new Date();
    const date = new Date(this.props._value);

    return (
      today.getMonth() === date.getMonth() && today.getDate() === date.getDate()
    );
  }
  public isSameDay(cDate: DomainDate): boolean {
    const date = new Date(cDate.toString());
    const internalDate = new Date(this.props._value);
    return (
      date.getMonth() === internalDate.getMonth() &&
      date.getDate() === internalDate.getDate() &&
      date.getFullYear() === internalDate.getFullYear()
    );
  }

  public isBefore(date: DomainDate): boolean {
    const thisDate = new Date(this.props._value);
    const otherDate = new Date(date.props._value);

    return thisDate < otherDate;
  }

  public isAfter(date: DomainDate): boolean {
    const thisDate = new Date(this.props._value);
    const otherDate = new Date(date.props._value);

    return thisDate > otherDate;
  }
  public diffInDays(otherDate: DomainDate): number {
    const thisDate = new Date(this.props._value);
    const compareDate = new Date(otherDate.getDate());
    // Normalize both dates to midnight
    thisDate.setHours(0, 0, 0, 0);
    compareDate.setHours(0, 0, 0, 0);
    const diffMilliseconds = Math.abs(
      thisDate.getTime() - compareDate.getTime()
    );
    return Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
  }
  toString(): string {
    return this.props._value;
  }
  getDate(): Date {
    return new Date(this.props._value);
  }
  static create(date?: string): Result<DomainDate> {
    try {
      const cDate = new DomainDate(date);
      return Result.ok<DomainDate>(cDate);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
