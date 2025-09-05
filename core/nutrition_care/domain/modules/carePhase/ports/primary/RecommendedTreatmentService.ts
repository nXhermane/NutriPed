import { TREATMENT_PLAN_IDS } from "@/core/constants";
import { AggregateID, Result } from "@/core/shared";
import { ValueOf } from "@/utils";
import { IRecommendedTreatment } from "../../models";

export interface IRecommendedTreatmentService {
  /**
   * Récupère un RecommendedTreatment par son code de recommandation
   * @param recommendationCode Le code de la recommandation (TREATMENT_PLAN_IDS)
   */
  getByRecommendationCode(
    recommendationCode: ValueOf<typeof TREATMENT_PLAN_IDS>
  ): Promise<Result<IRecommendedTreatment & { id: AggregateID }>>;
}
