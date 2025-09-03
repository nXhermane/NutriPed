import { CARE_PHASE_CODES } from "@/core/constants";
import { AppServiceResponse, Result } from "@shared";

export interface OrientationResultDto {
  code: string;
  treatmentPhase?: CARE_PHASE_CODES;
}

export type OrientResponse = AppServiceResponse<OrientationResultDto>;
