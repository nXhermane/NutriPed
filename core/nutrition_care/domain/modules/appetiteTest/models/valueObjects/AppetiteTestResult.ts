import {
  formatError,
  handleError,
  Result,
  SystemCode,
  ValueObject,
} from "@shared";
import { APPETITE_TEST_RESULT_CODES } from "../constants";

export interface IAppetiteTestResult {
  code: SystemCode;
  result: APPETITE_TEST_RESULT_CODES;
}

export class AppetiteTestResult extends ValueObject<IAppetiteTestResult> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected validate(props: Readonly<IAppetiteTestResult>): void {}
  static create(props: {
    code: string;
    result: APPETITE_TEST_RESULT_CODES;
  }): Result<AppetiteTestResult> {
    try {
      const codeRes = SystemCode.create(props.code);
      if (codeRes.isFailure)
        return Result.fail(formatError(codeRes, AppetiteTestResult.name));
      return Result.ok(
        new AppetiteTestResult({ code: codeRes.val, result: props.result })
      );
    } catch (e) {
      return handleError(e);
    }
  }
}
