import { EntityBaseRepositoryWeb } from "@/adapter/shared";
import { RecommendedTreatmentPersistenceDto } from "../../dtos/carePhase/RecommendedTreatmentPersistenceDto";
import { RecommendedTreatment, RecommendedTreatmentRepository } from "@/core/nutrition_care";
import { TREATMENT_PLAN_IDS } from "@/core/constants";
import { SystemCode } from "@/core/shared";
import { ValueOf } from "@/utils";

export class RecommendedTreatmentRepositoryWeb
  extends EntityBaseRepositoryWeb<RecommendedTreatment, RecommendedTreatmentPersistenceDto>
  implements RecommendedTreatmentRepository
{
  getByCode(code: SystemCode<ValueOf<typeof TREATMENT_PLAN_IDS>>): Promise<RecommendedTreatment> {
    throw new Error("Method not implemented.");
  }
  protected storeName = "recommended_treatments";
}
