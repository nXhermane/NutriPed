import {
  CarePlanRecommendation,
  CarePlanAjustement,
} from "./../../../../modules";
import { CarePhase } from "../../models";
import { Result } from "@/core/shared";
/**
 * Service responsable de l'application des plans de soins à une phase de soins.
 *
 * Le processus d'application suit ces étapes :
 * 1. Synchroniser les traitements recommandés avec ceux en cours
 * 2. Synchroniser les paramètres de monitoring recommandés
 * 3. Exécuter les triggers onStart pour les nouveaux traitements
 * 4. Exécuter les triggers onEnd pour les traitements arrêtés
 * 5. Appliquer toutes les modifications à la phase de soins
 */
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
