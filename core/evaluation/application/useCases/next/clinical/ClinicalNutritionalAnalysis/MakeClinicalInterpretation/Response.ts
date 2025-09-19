import { NextClinicalDtos } from "@/core/evaluation/application/dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type MakeClinicalInterpretationResponse = Either<
  ExceptionBase | unknown,
  Result<NextClinicalDtos.ClinicalNutritionalAnalysisDto[]>
>;
