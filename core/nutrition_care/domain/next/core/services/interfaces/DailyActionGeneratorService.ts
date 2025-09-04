import { DomainDateTime, Result } from "@/core/shared";
import { DailyCareAction, OnGoingTreatment } from "../../models";

export interface IDailyActionGeneratorService {
  /**
   * Génère une action quotidienne pour un traitement
   * @param treatment Le traitement
   * @param actionEffectiveDates Les dates d'effet des actions
   * @param context Le contexte
   * @returns La résultat de la génération
   */
  generate(
    treatment: OnGoingTreatment,
    actionEffectiveDates: DomainDateTime[],
    context: Record<string, number>
  ): Promise<Result<DailyCareAction[]>>;
}
