import {
  EmptyStringError,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@shared";

export interface IClinicalSign<T> {
  code: SystemCode;
  data: T;
}

export class ClinicalSign<T> extends ValueObject<IClinicalSign<T>> {
  protected validate(props: Readonly<IClinicalSign<T>>): void {
    if (Guard.isEmpty(props.code).succeeded) {
      throw new EmptyStringError("The clinical sign code can't be empty.");
    }
  }
  static create<T>(code: string, data: T): Result<ClinicalSign<T>> {
    try {
      const codeRes = SystemCode.create(code);
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, ClinicalSign.name));
      const sign = new ClinicalSign({ code: codeRes.val, data });
      return Result.ok(sign);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
