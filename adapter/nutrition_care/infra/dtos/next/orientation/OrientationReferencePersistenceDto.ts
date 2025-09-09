import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, CreateCriterion } from "@/core/shared";

export interface OrientationReferencePersistenceDto {
  id: AggregateID;
  name: string;
  code: string;
  criteria: CreateCriterion[];
  treatmentPhase: CARE_PHASE_CODES | undefined;
  createdAt: string;
  updatedAt: string;
}
