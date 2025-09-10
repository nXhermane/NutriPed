import { FormulaFieldReferenceDto } from "@/core/evaluation/application/dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetFormulaFieldReferenceResponse = Either<
  ExceptionBase | unknown,
  Result<FormulaFieldReferenceDto[]>
>;
