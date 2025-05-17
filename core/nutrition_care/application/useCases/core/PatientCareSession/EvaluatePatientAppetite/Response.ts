import { Either, ExceptionBase, Result } from "@shared";
import { AppetiteTestResultDto } from "../../../appetiteTest";

export type EvaluatePatientAppetiteResponse = Either<ExceptionBase | unknown, Result<AppetiteTestResultDto>>;
