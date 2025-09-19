import { Guard, Result } from "../../../core";
import { EmptyStringError, handleError } from "../../../exceptions";
import { DomainPrimitive, ValueObject } from "../../common";

export class SystemCode<T extends string = string> extends ValueObject<T> {
  protected validate(props: Readonly<DomainPrimitive<string>>): void {
    if (Guard.isEmpty(props._value).succeeded) {
      throw new EmptyStringError("The system code can't be empty.");
    }
  }
  static create<T extends string = string>(code: T): Result<SystemCode<T>> {
    try {
      return Result.ok(new SystemCode({ _value: code } as any));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
