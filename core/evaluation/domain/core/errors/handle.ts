import { ErrorPath, getNestedError, Result } from "@shared";
import { CORE_SERVICE_ERRORS } from "./message";

export function handleDiagnosticCoreError(
  errorPath: ErrorPath,
  details?: string
): Result<never> {
  const error = getNestedError(CORE_SERVICE_ERRORS, errorPath);

  if (!error) {
    return Result.fail(`Unknown error code: ${errorPath}`);
  }

  const errorMessage = `[${error.code}] ${error.message}${details ? ` - ${details}` : ""}`;

  return Result.fail(errorMessage);
}
