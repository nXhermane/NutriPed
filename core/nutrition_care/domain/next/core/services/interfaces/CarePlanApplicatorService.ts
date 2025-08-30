import { CarePlanRecommendation, CarePlanAjustement } from "./../../../../modules";
import { CarePhase } from "../../models";
import { Result } from "@/core/shared";

export interface ICarePlanApplicatorService {

  /**
   * Applique un plan de soins à une phase de soins.
   * Crée les OnGoingTreatment et MonitoringParameter et les ajoute à la CarePhase.
   * @param recommendation Le DTO de recommandation venant de l'orchestrateur.
   * @param targetCarePhase La phase de soins à laquelle appliquer le plan.
   */
  applyPlan(
    recommendation: CarePlanRecommendation,
    targetCarePhase: CarePhase
  ): Promise<Result<void>>;

  /**
   * Applique des ajustements à une phase de soins existante.
   * @param ajustement Le DTO d'ajustement venant de l'orchestrateur.
   * @param targetCarePhase La phase de soins à modifier.
   */
  applyAjustments(
    ajustement: CarePlanAjustement,
    targetCarePhase: CarePhase
  ): Promise<Result<void>>;
}
