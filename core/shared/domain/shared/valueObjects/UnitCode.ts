import { Guard, Result } from "../../../core";
import { EmptyStringError, handleError } from "../../../exceptions";
import { DomainPrimitive } from "../../common";
import { SystemCode } from "./SystemCode";

export class UnitCode extends SystemCode {
  protected validate(props: Readonly<DomainPrimitive<string>>): void {
    if (Guard.isEmpty(props._value).succeeded) {
      throw new EmptyStringError(
        "The UnitCode can't be empty. Please provide a valid unit."
      );
    }
  }
  static create(code: string): Result<UnitCode> {
    try {
      return Result.ok(new UnitCode({ _value: code }));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
