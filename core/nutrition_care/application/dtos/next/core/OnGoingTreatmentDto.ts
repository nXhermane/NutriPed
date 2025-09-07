import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface OnGoingTreatmentDto {
  id: AggregateID;
  code: string;
  startDate: string;
  endDate: string | null;
  status: NextCore.OnGoingTreatmentStatus;
  nextActionDate: string | null;
  lastExecutionDate: string | null;
  recommendation: NextCore.IOnGoingTreatmentRecommendation;
  createdAt: string;
  updatedAt: string;
}
