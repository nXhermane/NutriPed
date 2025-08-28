import { DomainPrimitive, ValueObject } from "./../../common/ValueObject";
import { Guard, Result } from "./../../../core";
import {
  ArgumentInvalidException,
  ArgumentNotProvidedException,
  ArgumentOutOfRangeException,
  handleError,
  InvalidArgumentFormatError,
} from "./../../../exceptions";

export class DomainDateTime extends ValueObject<string> {
  constructor(dateTime?: string | Date) {
    if (Guard.isEmpty(dateTime).succeeded) {
      const now = new Date();
      super({ _value: now.toISOString() });
    } else if (dateTime instanceof Date) {
      super({ _value: dateTime.toISOString() });
    } else {
      super({ _value: dateTime as string });
    }
  }

  protected validate(props: Readonly<DomainPrimitive<string>>): void {
    if (Guard.isEmpty(props._value).succeeded) {
      throw new ArgumentNotProvidedException("The datetime must not be empty.");
    }

    // Formats supportés :
    // ISO 8601: 2024-12-25T14:30:45.123Z ou 2024-12-25T14:30:45.123
    // Format avec espaces: 2024-12-25 14:30:45.123
    // Format français: 25/12/2024 14:30:45.123
    // Format américain: 12/25/2024 14:30:45.123
    const dateTimeFormatsRegex = [
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/, // ISO 8601
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d{3})?$/, // YYYY-MM-DD HH:mm:ss.sss
      /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}(\.\d{3})?$/, // DD/MM/YYYY HH:mm:ss.sss
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?[+-]\d{2}:\d{2}$/, // ISO with timezone
    ];

    let validFormat = false;
    for (const regex of dateTimeFormatsRegex) {
      if (regex.test(props._value)) {
        validFormat = true;
        break;
      }
    }

    if (!validFormat) {
      throw new InvalidArgumentFormatError(
        "Invalid datetime format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ) or similar supported formats."
      );
    }

    // Validation de la date en créant un objet Date
    const date = new Date(props._value);
    if (isNaN(date.getTime())) {
      throw new ArgumentInvalidException("Invalid datetime value.");
    }

    // Validation des composants de temps
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();

    if (hours < 0 || hours > 23) {
      throw new ArgumentOutOfRangeException(
        "Invalid hour. Use a value between 0 and 23."
      );
    }

    if (minutes < 0 || minutes > 59) {
      throw new ArgumentOutOfRangeException(
        "Invalid minute. Use a value between 0 and 59."
      );
    }

    if (seconds < 0 || seconds > 59) {
      throw new ArgumentOutOfRangeException(
        "Invalid second. Use a value between 0 and 59."
      );
    }

    if (milliseconds < 0 || milliseconds > 999) {
      throw new ArgumentOutOfRangeException(
        "Invalid millisecond. Use a value between 0 and 999."
      );
    }
  }

  public isLeapYear(): boolean {
    const date = new Date(this.props._value);
    const year = date.getFullYear();
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  }

  public isToday(): boolean {
    const today = new Date();
    const date = new Date(this.props._value);

    return (
      today.getFullYear() === date.getFullYear() &&
      today.getMonth() === date.getMonth() &&
      today.getDate() === date.getDate()
    );
  }

  public isSameDateTime(other: DomainDateTime): boolean {
    return this.props._value === other.props._value;
  }

  public isSameDay(other: DomainDateTime): boolean {
    const thisDate = new Date(this.props._value);
    const otherDate = new Date(other.props._value);

    return (
      thisDate.getFullYear() === otherDate.getFullYear() &&
      thisDate.getMonth() === otherDate.getMonth() &&
      thisDate.getDate() === otherDate.getDate()
    );
  }

  public isBefore(other: DomainDateTime): boolean {
    const thisDate = new Date(this.props._value);
    const otherDate = new Date(other.props._value);
    return thisDate < otherDate;
  }

  public isAfter(other: DomainDateTime): boolean {
    const thisDate = new Date(this.props._value);
    const otherDate = new Date(other.props._value);
    return thisDate > otherDate;
  }

  public diffInMilliseconds(other: DomainDateTime): number {
    const thisDate = new Date(this.props._value);
    const otherDate = new Date(other.props._value);
    return Math.abs(thisDate.getTime() - otherDate.getTime());
  }

  public diffInSeconds(other: DomainDateTime): number {
    return Math.floor(this.diffInMilliseconds(other) / 1000);
  }

  public diffInMinutes(other: DomainDateTime): number {
    return Math.floor(this.diffInMilliseconds(other) / (1000 * 60));
  }

  public diffInHours(other: DomainDateTime): number {
    return Math.floor(this.diffInMilliseconds(other) / (1000 * 60 * 60));
  }

  public diffInDays(other: DomainDateTime): number {
    const thisDate = new Date(this.props._value);
    const otherDate = new Date(other.props._value);

    // Normaliser les dates à minuit pour compter les jours complets
    thisDate.setHours(0, 0, 0, 0);
    otherDate.setHours(0, 0, 0, 0);

    const diffMilliseconds = Math.abs(thisDate.getTime() - otherDate.getTime());
    return Math.floor(diffMilliseconds / (1000 * 60 * 60 * 24));
  }

  public addMilliseconds(ms: number): DomainDateTime {
    const date = new Date(this.props._value);
    date.setMilliseconds(date.getMilliseconds() + ms);
    return new DomainDateTime(date);
  }

  public addSeconds(seconds: number): DomainDateTime {
    const date = new Date(this.props._value);
    date.setSeconds(date.getSeconds() + seconds);
    return new DomainDateTime(date);
  }

  public addMinutes(minutes: number): DomainDateTime {
    const date = new Date(this.props._value);
    date.setMinutes(date.getMinutes() + minutes);
    return new DomainDateTime(date);
  }

  public addHours(hours: number): DomainDateTime {
    const date = new Date(this.props._value);
    date.setHours(date.getHours() + hours);
    return new DomainDateTime(date);
  }

  public addDays(days: number): DomainDateTime {
    const date = new Date(this.props._value);
    date.setDate(date.getDate() + days);
    return new DomainDateTime(date);
  }

  public getYear(): number {
    return new Date(this.props._value).getFullYear();
  }

  public getMonth(): number {
    return new Date(this.props._value).getMonth() + 1; // 1-12
  }

  public getDay(): number {
    return new Date(this.props._value).getDate();
  }

  public getHours(): number {
    return new Date(this.props._value).getHours();
  }

  public getMinutes(): number {
    return new Date(this.props._value).getMinutes();
  }

  public getSeconds(): number {
    return new Date(this.props._value).getSeconds();
  }

  public getMilliseconds(): number {
    return new Date(this.props._value).getMilliseconds();
  }

  public toISOString(): string {
    return new Date(this.props._value).toISOString();
  }

  public toDateOnly(): string {
    const date = new Date(this.props._value);
    return date.toISOString().split("T")[0];
  }

  public toTimeOnly(): string {
    const date = new Date(this.props._value);
    return date.toISOString().split("T")[1].replace("Z", "");
  }

  public toString(): string {
    return this.props._value;
  }

  public toDate(): Date {
    return new Date(this.props._value);
  }

  public getTimestamp(): number {
    return new Date(this.props._value).getTime();
  }

  static create(dateTime?: string | Date): Result<DomainDateTime> {
    try {
      const domainDateTime = new DomainDateTime(dateTime);
      return Result.ok<DomainDateTime>(domainDateTime);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  static now(): DomainDateTime {
    return new DomainDateTime();
  }

  static fromTimestamp(timestamp: number): Result<DomainDateTime> {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        throw new ArgumentInvalidException("Invalid timestamp value.");
      }
      return Result.ok<DomainDateTime>(new DomainDateTime(date));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
