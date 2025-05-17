import { Either, ExceptionBase, Result } from "@shared";
import { NutritionalRiskFactorDto } from "../../../../dtos";

export type GetNutritionalRiskFactorResponse = Either<ExceptionBase | unknown, Result<NutritionalRiskFactorDto[]>>;
