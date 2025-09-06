import { AggregateID } from "@/core/shared";
import { DailyCareActionStatus, DailyCareActionType } from "@/core/nutrition_care/domain/next/core/models/entities";
import { INutritionalAction, IMedicalAction } from "@/core/nutrition_care/domain/next/core/models/valueObjects";

export interface DailyCareActionDto {
  id: AggregateID;
  treatmentId: AggregateID;
  status: DailyCareActionStatus;
  type: DailyCareActionType;
  action: INutritionalAction | IMedicalAction;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}
