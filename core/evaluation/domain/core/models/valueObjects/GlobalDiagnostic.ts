import {
  EmptyStringError,
  Guard,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@shared";

export interface IGlobalDiagnostic {
  code: SystemCode;
  criteriaUsed: string[];
}

export class GlobalDiagnostic extends ValueObject<IGlobalDiagnostic> {
  protected validate(props: Readonly<IGlobalDiagnostic>): void {
    if (props.criteriaUsed.some(value => Guard.isEmpty(value).succeeded)) {
      throw new EmptyStringError(
        "The used Criteria on global diagnostic can't be empty."
      );
    }
  }
  static create(
    code: string,
    criteriaUsed: string[]
  ): Result<GlobalDiagnostic> {
    try {
      const codeRes = SystemCode.create(code);
      if (codeRes.isFailure) return Result.fail(String(codeRes.err));
      return Result.ok(
        new GlobalDiagnostic({ code: codeRes.val, criteriaUsed: criteriaUsed })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
