import { AggregateID, DomainDateTime, Result } from "@/core/shared";
import { CarePhase } from "../../models";

export interface ICareSessionVariableGeneratorService {
  /**
   * @method generateIntialVariable - Cette methode generere l'ensemble des variables initiales dont j'ai besoins pour récupérer les traitements standard.
   * @param patientId - C'est l'id du patient pour lequel nous voulons générer le context.
   * @param tragetDate - C'est la date pour lequel nous voulons générer
   */
  generateIntialVariables(
    patientId: AggregateID,
    tragetDate: DomainDateTime
  ): Promise<Result<Record<string, string | number>>>;
  generateEvaluationVariables(
    patientId: AggregateID,
    currentCarePhase: CarePhase,
    targetDate: DomainDateTime
  ): Promise<Result<Record<string, number | string>>>;
}
