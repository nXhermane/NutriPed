import { Guard, Result } from "../../../core";
import { EmptyStringError, handleError } from "../../../exceptions";
import { DomainPrimitive, ValueObject } from "../../common";

export class SystemCode extends ValueObject<string> {
  protected validate(props: Readonly<DomainPrimitive<string>>): void {
    if (Guard.isEmpty(props._value).succeeded) {
      throw new EmptyStringError("The system code can't be empty.");
    }
  }
  static create(code: string): Result<SystemCode> {
    try {
      return Result.ok(new SystemCode({ _value: code }));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
