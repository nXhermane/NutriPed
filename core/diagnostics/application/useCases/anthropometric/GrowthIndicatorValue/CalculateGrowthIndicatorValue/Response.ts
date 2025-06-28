import { GrowthIndicatorValueDto } from "./../../../../dtos";
import { AnthropometricVariableObject } from "./../../../../../domain";
import { Either, ExceptionBase, Result } from "@shared";

export type CalculateGrowthIndicatorValueDto = {
  variables: AnthropometricVariableObject;
  growthIndicatorValue: GrowthIndicatorValueDto;
};
export type CalculateGrowthIndicatorValueResponse = Either<
  ExceptionBase | unknown,
  Result<CalculateGrowthIndicatorValueDto>
>;
