import { NutritionalAssessmentResultDto } from "../../../../dtos";
import { Either, ExceptionBase, Result } from "@shared";

export type MakeIndependantDiagnosticResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalAssessmentResultDto>
>;
