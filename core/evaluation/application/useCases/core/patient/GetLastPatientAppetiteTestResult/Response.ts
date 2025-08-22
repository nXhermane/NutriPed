import { Either, ExceptionBase, Result } from "@/core/shared";
import { AppetiteTestResultDto } from "../../../appetite_test";

export type GetLastPatientAppetiteTestResultResponse = Either<ExceptionBase | unknown, Result<AppetiteTestResultDto>>