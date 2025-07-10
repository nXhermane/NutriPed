import { Either, ExceptionBase, Result } from "@shared";
import { NutritionalAssessmentResultDto } from "../../../../dtos";

export type GenerateDiagnosticResultResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalAssessmentResultDto>
>;
