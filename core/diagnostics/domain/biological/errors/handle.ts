import { ErrorPath, getNestedError, Result } from "@shared";
import { BIOLOGICAL_SERVICE_ERRORS } from "./messages";

export function handleBiologicalError(errorPath: ErrorPath, details?: string): Result<never> {
   const error = getNestedError(BIOLOGICAL_SERVICE_ERRORS, errorPath);

   if (!error) {
      return Result.fail(`Unknown error code: ${errorPath}`);
   }

   const errorMessage = `[${error.code}] ${error.message}${details ? ` - ${details}` : ""}`;

   return Result.fail(errorMessage);
}
