import { Either, ExceptionBase, Result } from "@shared";

export type AddDataToPatientCareSessionResponse = Either<ExceptionBase | unknown, Result<void>>;
