import { EntityPersistenceDto } from "@/adapter/shared";
import { AggregateID } from "@/core/shared";
import { NextCore } from "@/core/nutrition_care/domain";

export interface DailyCareActionPersistenceDto extends EntityPersistenceDto {
  treatmentId: AggregateID;
  status: NextCore.DailyCareActionStatus;
  type: NextCore.DailyCareActionType;
  action: NextCore.CreateNutritionalAction | NextCore.CreateMedicalAction;
  effectiveDate: string;
}
