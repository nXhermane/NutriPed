import { AggregateID } from "@/core/shared";
import { OnGoingTreatmentStatus } from "@/core/nutrition_care/domain/next/core/models/entities";
import { IOnGoingTreatmentRecommendation } from "@/core/nutrition_care/domain/next/core/models/valueObjects";

export interface OnGoingTreatmentDto {
  id: AggregateID;
  code: string;
  startDate: string;
  endDate: string | null;
  status: OnGoingTreatmentStatus;
  nextActionDate: string | null;
  lastExecutionDate: string | null;
  recommendation: IOnGoingTreatmentRecommendation;
  createdAt: string;
  updatedAt: string;
}
