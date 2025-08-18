import { Either, ExceptionBase, Result } from "@/core/shared";

export type ValidateDataFieldResponseResponse = Either<ExceptionBase | unknown, Result<boolean>>