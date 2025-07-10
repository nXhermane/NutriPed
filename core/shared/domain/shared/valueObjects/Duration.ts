import { Guard, Result } from "./../../../core";
import { ValueObject } from "../../common";
import { handleError } from "./../../../exceptions";

export interface IDuration {
  seconds?: number;
  minutes?: number;
  hours?: number;
  days?: number;
}

export class Duration extends ValueObject<IDuration> {
  protected validate(props: Readonly<IDuration>): void {
    if (Guard.isEmpty(props).succeeded) {
      throw new Error(
        "The duration properties are required and cannot be empty."
      );
    }
    if (props.seconds && Guard.isNegative(props.seconds).succeeded) {
      throw new Error("The seconds value cannot be negative.");
    }
    if (props.minutes && Guard.isNegative(props.minutes).succeeded) {
      throw new Error("The minutes value cannot be negative.");
    }
    if (props.hours && Guard.isNegative(props.hours).succeeded) {
      throw new Error("The hours value cannot be negative.");
    }
    if (props.days && Guard.isNegative(props.days).succeeded) {
      throw new Error("The days value cannot be negative.");
    }
  }

  toSeconds(): number {
    return (
      (this.props.seconds || 0) +
      (this.props.minutes || 0) * 60 +
      (this.props.hours || 0) * 3600 +
      (this.props.days || 0) * 86400
    );
  }
  toMinutes(): number {
    return (
      (this.props.seconds || 0) / 60 +
      (this.props.minutes || 0) +
      (this.props.hours || 0) * 60 +
      (this.props.days || 0) * 1440
    );
  }
  toHours(): number {
    return (
      (this.props.seconds || 0) / 3600 +
      (this.props.minutes || 0) / 60 +
      (this.props.hours || 0) +
      (this.props.days || 0) * 24
    );
  }
  toDays(): number {
    return (
      (this.props.seconds || 0) / 86400 +
      (this.props.minutes || 0) / 1440 +
      (this.props.hours || 0) / 24 +
      (this.props.days || 0)
    );
  }
  static create(props: IDuration): Result<Duration> {
    try {
      return Result.ok(new Duration(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
