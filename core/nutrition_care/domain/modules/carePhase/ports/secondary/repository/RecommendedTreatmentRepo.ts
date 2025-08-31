import { Repository, SystemCode } from "@/core/shared";
import { RecommendedTreatment } from "../../../models";
import { TREATMENT_PLAN_IDS } from "@/core/constants";
import { ValueOf } from "@/utils";

export interface RecommendedTreatmentRepository
  extends Repository<RecommendedTreatment> {
  getByCode(
    code: SystemCode<ValueOf<typeof TREATMENT_PLAN_IDS>>
  ): Promise<RecommendedTreatment>;
}
