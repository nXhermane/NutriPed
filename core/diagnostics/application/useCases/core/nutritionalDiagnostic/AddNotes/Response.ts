import { Either, ExceptionBase, Result } from "@shared";

export type AddNoteToNutritionalDiagnosticResponse = Either<ExceptionBase | unknown, Result<void>>;
