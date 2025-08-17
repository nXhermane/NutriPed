import { ErrorPath, getNestedError, Result } from "@/core/shared";
import { DATA_FIELD_ERROS } from "./messages";

export function handleDataFieldError<T = never>(path: ErrorPath, details?: string): Result<T> {
    const error = getNestedError(DATA_FIELD_ERROS, path)
    if (!error) {
        return Result.fail(`Unknown error code : ${path}`)
    }
    const errorMessage = `[${error.code}] ${error.message} \n ${details ? `[Detail]: ${details}` : ""}`;
    return Result.fail(errorMessage)
}