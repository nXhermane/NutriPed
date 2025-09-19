import { EntityPersistenceDto } from "@/adapter/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface OnGoingTreatmentPersistenceDto extends EntityPersistenceDto {
  code: string;
  startDate: string;
  endDate: string | null;
  status: NextCore.OnGoingTreatmentStatus;
  nextActionDate: string | null;
  lastExecutionDate: string | null;
  recommendation: NextCore.CreateOnGoingTreatmentRecommendation;
}
