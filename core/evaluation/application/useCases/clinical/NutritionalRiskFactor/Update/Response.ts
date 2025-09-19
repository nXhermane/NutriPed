import { Either, ExceptionBase, Result } from "@shared";
import { NutritionalRiskFactorDto } from "../../../../dtos";

export type UpdateNutritionalRiskFactorResponse = Either<
  ExceptionBase | unknown,
  Result<NutritionalRiskFactorDto>
>;
