import { DomainDate } from "./Date";
import { Result } from "./../../../core";
import { handleError } from "./../../../exceptions";
export class Birthday extends DomainDate {
  public static HOURS_IN_DAY = 24;
  public static MINUTES_IN_HOURS = 60;
  public static SECONDS_IN_MINUTE = 60;
  public static MILLISECONDS_IN_SECOND = 1000;
  constructor(date: string) {
    super(date);
  }
  getAge(): number {
    const today = new Date();
    const birthDate = new Date(this.props._value);

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  }
  getAgeInDays(): number {
    const now = new Date();
    const birthDate = new Date(this.props._value);
    const diffInMs = now.getTime() - birthDate.getTime();
    // Convert Milliseconds in days
    return Math.floor(
      diffInMs /
        (Birthday.MILLISECONDS_IN_SECOND *
          Birthday.SECONDS_IN_MINUTE *
          Birthday.MINUTES_IN_HOURS *
          Birthday.HOURS_IN_DAY)
    );
  }

  public isBirthdayToday(): boolean {
    return super.isDateToday();
  }

  toString(): string {
    return super.toString();
  }
  static create(date: string): Result<Birthday> {
    try {
      const birthday = new Birthday(date);
      return Result.ok<Birthday>(birthday);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
