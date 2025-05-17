import { ErrorPath, getNestedError, Result } from "@shared";
import { APPETITE_TEST_ERRORS } from "./messages";

export function handleAppetiteTestError(errorPath: ErrorPath, details?: string) {
   const error = getNestedError(APPETITE_TEST_ERRORS, errorPath);

   if (!error) {
      return Result.fail(`Unknown error code: ${errorPath}`);
   }

   const errorMessage = `[${error.code}] ${error.message}${details ? ` - ${details}` : ""}`;

   return Result.fail(errorMessage);
}
