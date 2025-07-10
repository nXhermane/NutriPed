export class DateManager {
  private static fixDateNumberToString(value: number): string {
    return value.toString().padStart(2, "0");
  }

  public static now(): number {
    return Date.now();
  }
  public static get date(): Date {
    return new Date();
  }
  public static formatTime(date: Date) {
    return `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }
  public static formatDate(date: Date): string {
    return (
      date.getFullYear() +
      "-" +
      this.fixDateNumberToString(date.getMonth() + 1) +
      "-" +
      this.fixDateNumberToString(date.getDate())
    );
  }
  public static dateToTimestamps(date: Date): string {
    const year = date.getUTCFullYear();
    const month = this.fixDateNumberToString(date.getUTCMonth() + 1);
    const day = this.fixDateNumberToString(date.getUTCDate());
    const hours = this.fixDateNumberToString(date.getUTCHours());
    const minutes = this.fixDateNumberToString(date.getUTCMinutes());
    const seconds = this.fixDateNumberToString(date.getUTCSeconds());

    const timestampFormat =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return timestampFormat;
  }
  public static dateToDateTimeString(date: Date): string {
    const year = date.getFullYear();
    const month = this.fixDateNumberToString(date.getMonth() + 1);
    const day = this.fixDateNumberToString(date.getDate());
    const hours = this.fixDateNumberToString(date.getHours());
    const minutes = this.fixDateNumberToString(date.getMinutes());
    const seconds = this.fixDateNumberToString(date.getSeconds());

    const datetimeFormat =
      year +
      "-" +
      month +
      "-" +
      day +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds;
    return datetimeFormat;
  }
}
