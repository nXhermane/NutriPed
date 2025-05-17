import { Either, ExceptionBase, Result } from "@shared";

export type DeletePatientResponse = Either<ExceptionBase | unknown, Result<void>>;
