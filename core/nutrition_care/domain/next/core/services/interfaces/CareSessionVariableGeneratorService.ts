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
  /**
   * @method generateActionGenerationContextVariables - Cette methode genere l'ensemble des variables dont le context de generation des actions quotidiennes auront besoins.
   * @param patientId - l'identifiant unique du patient pour pouvoir identifier son dossier médicale.
   * @param currentCarePhase - le plan de traitement en cours (ou la phase de traitement en cours).
   * @param targetDate - c'est la date pour lequel nous voulons générer le context
   */
  generateActionGenerationContextVariables(
    patientId: AggregateID,
    currentCarePhase: CarePhase,
    targetDate: DomainDateTime
  ): Promise<Result<Record<string, number | string>>>;
}
