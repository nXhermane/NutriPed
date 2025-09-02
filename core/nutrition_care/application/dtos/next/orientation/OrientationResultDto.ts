import { CARE_PHASE_CODES } from "@/core/constants";

export interface OrientationResultDto {
  code: string;
  treatmentPhase?: CARE_PHASE_CODES;
}
