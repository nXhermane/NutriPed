import { RECOMMENDED_TREATMENT_TYPE, TREATMENT_PLAN_IDS, MEDICINE_CODES } from "@/core/constants";
import { CreateCriterion } from "@/core/shared";
import { CreateTreatmentTrigger, IDuration, IFrequency } from "@/core/nutrition_care/domain/modules/carePhase/models/valueObjects";
import { MilkType } from "@/core/nutrition_care/domain/modules/milk";
import { EntityPersistenceDto } from "../../../../shared";
import { ValueOf } from "@/utils";

export interface RecommendedTreatmentPersistenceDto extends EntityPersistenceDto {
  code: ValueOf<typeof TREATMENT_PLAN_IDS>;
  applicabilyCondition: CreateCriterion;
  type: RECOMMENDED_TREATMENT_TYPE;
  treatmentCode: MilkType | MEDICINE_CODES;
  duration: IDuration;
  frequency: IFrequency;
  triggers: {
    onStart: CreateTreatmentTrigger[];
    onEnd: CreateTreatmentTrigger[];
  };
  ajustmentPercentage?: number;
}
