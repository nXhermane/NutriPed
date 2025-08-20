import { ErrorPath, getNestedError, Result } from "@shared";
import { CLINICAL_ERRORS } from "./messages";

export function handleClinicalError<T = any>(
  errorPath: ErrorPath,
  details?: string
) {
  const error = getNestedError(CLINICAL_ERRORS, errorPath);
  if (!error) {
    return Result.fail<T>(`Unknown error code: ${errorPath}`);
  }

  const errorMessage = `[${error.code}] ${error.message}${details ? ` - ${details}` : ""}`;

  return Result.fail<T>(errorMessage);
}
