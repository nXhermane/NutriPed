import { Result } from "../core";
import { ExceptionBase } from "./exception.base";

export function handleError(error: unknown): Result<ExceptionBase | any> {
   if (error instanceof ExceptionBase) return Result.fail<ExceptionBase>(`[${error.code}]:${error.message}`);
   return Result.fail<any>(`Unexpected Error : ${error}`);
}
export function formatError(res: Result<any>, parentConstructor: string = "Unknown"): string {
   return `[Error on ${parentConstructor}]: ${res.err}`;
}
