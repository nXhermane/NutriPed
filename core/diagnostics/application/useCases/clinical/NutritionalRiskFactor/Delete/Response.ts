import { Either, ExceptionBase, Result } from "@shared";
import { NutritionalRiskFactorDto } from "../../../../dtos";

export type DeleteNutritionalRiskFactorResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalRiskFactorDto>
>;
