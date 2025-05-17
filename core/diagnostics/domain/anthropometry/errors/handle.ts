import { ErrorPath, getNestedError, Result } from "@shared";
import { ANTHROPOMETRIC_MEASURE_ERROR, GROWTH_INDICATOR_ERRORS } from "./messages";

export function handleGrowthIndicatorError(errorPath: ErrorPath, details?: string): Result<never> {
   const error = getNestedError(GROWTH_INDICATOR_ERRORS, errorPath);

   if (!error) {
      return Result.fail(`Unknown error code: ${errorPath}`);
   }

   const errorMessage = `[${error.code}] ${error.message}${details ? ` - ${details}` : ""}`;

   return Result.fail(errorMessage);
}

export function handleAnthropometricError(errorPath: ErrorPath, details?: string): Result<never> {
   const error = getNestedError(ANTHROPOMETRIC_MEASURE_ERROR, errorPath);

   if (!error) {
      return Result.fail(`Unknown error code: ${errorPath}`);
   }

   const errorMessage = `[${error.code}] ${error.message}${details ? ` - ${details}` : ""}`;

   return Result.fail(errorMessage);
}
