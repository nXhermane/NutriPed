import { ValueObject } from "./../../common";
import { ArgumentInvalidException, handleError } from "../../../exceptions";
import { Result } from "./../../../core";
export enum Sex {
  MALE = "M",
  FEMALE = "F",
  OTHER = "O",
}

export class Gender extends ValueObject<Sex> {
  constructor(sex: Sex) {
    super({ _value: sex });
  }

  protected validate(props: { _value: Sex }): void {
    if (!Object.values(Sex).includes(props._value)) {
      throw new ArgumentInvalidException("Invalid Sex value.");
    }
  }

  public isMale(): boolean {
    return this.props._value === Sex.MALE;
  }

  public isFemale(): boolean {
    return this.props._value === Sex.FEMALE;
  }

  public isOther(): boolean {
    return this.props._value === Sex.OTHER;
  }
  get sex(): "M" | "F" | "O" {
    return this.props._value;
  }
  public toString(): string {
    switch (this.props._value) {
      case Sex.MALE:
        return "Masculin";
      case Sex.FEMALE:
        return "Féminin";
      case Sex.OTHER:
        return "Autre";
      default:
        return "Inconnu";
    }
  }
  static create(sex: "M" | "F" | "O"): Result<Gender> {
    try {
      const gender = new Gender(sex as Sex);
      return Result.ok<Gender>(gender);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
