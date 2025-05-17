import { Either, ExceptionBase, Result } from "@shared";

export type CorrectDiagnosticResultResponse = Either<ExceptionBase | unknown, Result<boolean>>;
