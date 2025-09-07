import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface DailyCareActionDto {
  id: AggregateID;
  treatmentId: AggregateID;
  status: NextCore.DailyCareActionStatus;
  type: NextCore.DailyCareActionType;
  action: NextCore.INutritionalAction | NextCore.IMedicalAction;
  effectiveDate: string;
  createdAt: string;
  updatedAt: string;
}
