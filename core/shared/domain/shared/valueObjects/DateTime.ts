import { Guard, Result } from "../../../core";
import { ValueObject } from "../../common";
import { Time } from "./Time";
import { DomainDate } from "./Date";
import {
  ArgumentNotProvidedException,
  InvalidArgumentFormatError,
  handleError,
} from "../../../exceptions";

export interface IDateTime {
  date: string;
  time: string;
}

export class DateTime extends ValueObject<IDateTime> {
  protected validate(props: Readonly<IDateTime>): void {
    if (Guard.isEmpty(props.date).succeeded) {
      throw new ArgumentNotProvidedException("La date ne peut pas être vide.");
    }
    if (Guard.isEmpty(props.time).succeeded) {
      throw new ArgumentNotProvidedException("L'heure ne peut pas être vide.");
    }
    const dateRes = DomainDate.create(props.date);
    if (dateRes.isFailure) {
      throw new InvalidArgumentFormatError(`Date invalide: ${dateRes.err}`);
    }

    const timeRes = Time.create(props.time);
    if (timeRes.isFailure) {
      throw new InvalidArgumentFormatError(`Heure invalide: ${timeRes.err}`);
    }
  }

  public addHours(hours: number): DateTime {
    const dateObj = this.toDate();
    dateObj.setHours(dateObj.getHours() + hours);
    return DateTime.fromDate(dateObj);
  }

  public addMinutes(minutes: number): DateTime {
    const dateObj = this.toDate();
    dateObj.setMinutes(dateObj.getMinutes() + minutes);
    return DateTime.fromDate(dateObj);
  }

  public isBefore(other: DateTime): boolean {
    return this.toDate().getTime() < other.toDate().getTime();
  }

  public isAfter(other: DateTime): boolean {
    return this.toDate().getTime() > other.toDate().getTime();
  }

  public toDate(): Date {
    // Construire un objet Date JS à partir de la date et l'heure
    // Format attendu : "YYYY-MM-DDTHH:mm:00"
    return new Date(`${this.props.date}T${this.props.time}:00`);
  }

  public toString(): string {
    return `${this.props.date} ${this.props.time}`;
  }

  static fromDate(date: Date): DateTime {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");

    return new DateTime({ date: `${yyyy}-${mm}-${dd}`, time: `${hh}:${min}` });
  }

  static create(props: IDateTime): Result<DateTime> {
    try {
      const dt = new DateTime(props);
      return Result.ok<DateTime>(dt);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
