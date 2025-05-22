import { Either, ExceptionBase, Result } from "@shared";
import { NutritionalDiagnosticDto } from "../../../../dtos";

export type GetNutritionalDiagnosticResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalDiagnosticDto[]>
>;
