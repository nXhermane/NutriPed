import { Either, ExceptionBase, Result } from "@shared";
import { NutritionalDiagnosticDto } from "../../../../dtos";

export type DeleteNutritionalDiagnosticResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalDiagnosticDto>
>;
