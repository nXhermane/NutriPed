import { DATA_FIELD_CODE_TYPE } from "@/core/constants";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type NormalizeAndFillDefaultDataFieldResponseResponse = Either<ExceptionBase | unknown, Result<Record<DATA_FIELD_CODE_TYPE, number | string>>>;