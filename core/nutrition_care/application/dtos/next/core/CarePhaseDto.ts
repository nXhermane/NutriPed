import { CarePhaseStatus } from "@/core/nutrition_care/domain/next";
import { AggregateID } from "@shared";

export interface CarePhaseDto {
  id: AggregateID;
  status: CarePhaseStatus;
  startDate: string;
  endDate: null | string;
  monitoringParameters: AggregateID[];
  onGoingTreatments: AggregateID[];
  createdAt: string;
  updatedAt: string;
}
