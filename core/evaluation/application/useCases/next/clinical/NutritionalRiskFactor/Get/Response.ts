import { NextClinicalDtos } from "@/core/evaluation/application/dtos";
import { Either, ExceptionBase, Result } from "@/core/shared";

export type GetNutritionalRiskFactorResponse = Either<ExceptionBase | unknown, Result<NextClinicalDtos.NutritionalRiskFactorDto[]>>