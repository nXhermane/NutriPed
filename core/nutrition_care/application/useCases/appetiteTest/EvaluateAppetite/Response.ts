import { Either, ExceptionBase, Result } from "@shared";
import { APPETITE_TEST_RESULT_CODES } from "../../../../domain";
export type AppetiteTestResultDto = {
   code: string;
   result: APPETITE_TEST_RESULT_CODES;
};
export type EvaluateAppetiteResponse = Either<ExceptionBase | unknown, Result<AppetiteTestResultDto>>;
