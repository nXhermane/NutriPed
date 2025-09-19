import { CARE_PHASE_CODES } from "@/core/constants";
import { Either, ExceptionBase, Result } from "@shared";

export interface OrientationResultDto {
  code: string;
  treatmentPhase?: CARE_PHASE_CODES;
}

export type OrientResponse = Either<
  ExceptionBase | unknown,
  Result<OrientationResultDto>
>;
