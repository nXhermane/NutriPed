import { AggregateID, Result } from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { Message, PatientCareSession } from "../../models";
import { ContinuousEvaluationContext, OrchestratorContext, OrchestratorOperation, OrchestratorResult } from "../../services";

/**
 * PORT POUR L'ORCHESTRATEUR DE SOINS PATIENT
 *
 * Ce port définit l'interface publique pour l'orchestration des soins patient.
 * Il permet aux applications d'interagir avec le système d'orchestration sans
 * connaître les détails d'implémentation.
 */
export interface IPatientCareOrchestratorPort {

  /**
   * Orchestration principale - Point d'entrée unifié
   *
   * @param session Session de soin patient
   * @param operation Opération à exécuter
   * @param context Contexte additionnel (dates, réponses utilisateur, etc.)
   * @returns Résultat de l'orchestration
   */
  orchestrate(
    session: PatientCareSession,
    operation: OrchestratorOperation,
    context?: OrchestratorContext
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Orchestration automatique avec évaluation continue
   *
   * Lance un cycle d'orchestration automatique qui :
   * - Génère les daily plans jusqu'à aujourd'hui
   * - Gère automatiquement la completion selon les règles temporelles
   * - S'arrête si réponse utilisateur requise
   *
   * @param session Session de soin patient
   * @param context Variables patient et paramètres d'exécution
   * @returns Résultat final ou arrêt pour réponse utilisateur
   */
  orchestrateWithContinuousEvaluation(
    session: PatientCareSession,
    context?: ContinuousEvaluationContext
  ): Promise<Result<OrchestratorResult>>;

  // OPERATIONS DE GESTION DES SESSIONS

  /**
   * Initialise une nouvelle session de soin
   *
   * @param patientId ID du patient
   * @param phaseCode Code de la phase initiale
   * @param patientVariables Variables du patient (poids, âge, etc.)
   * @returns Session initialisée
   */
  initializePatientCareSession(
    patientId: AggregateID,
    phaseCode: CARE_PHASE_CODES,
    patientVariables?: Record<string, number>
  ): Promise<Result<PatientCareSession>>;

  /**
   * Récupère une session existante
   *
   * @param sessionId ID de la session
   * @returns Session récupérée
   */
  getPatientCareSession(sessionId: AggregateID): Promise<Result<PatientCareSession>>;

  // OPERATIONS DE COMPLETION

  /**
   * Marque une action comme complétée
   *
   * @param sessionId ID de la session
   * @param actionId ID de l'action à compléter
   * @returns Résultat de l'opération
   */
  completeAction(
    sessionId: AggregateID,
    actionId: AggregateID
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Marque une tâche comme complétée
   *
   * @param sessionId ID de la session
   * @param taskId ID de la tâche à compléter
   * @returns Résultat de l'opération
   */
  completeTask(
    sessionId: AggregateID,
    taskId: AggregateID
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Marque une action comme non complétée
   *
   * @param sessionId ID de la session
   * @param actionId ID de l'action
   * @returns Résultat de l'opération
   */
  markActionIncomplete(
    sessionId: AggregateID,
    actionId: AggregateID
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Marque une tâche comme non complétée
   *
   * @param sessionId ID de la session
   * @param taskId ID de la tâche
   * @returns Résultat de l'opération
   */
  markTaskIncomplete(
    sessionId: AggregateID,
    taskId: AggregateID
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Marque un record quotidien comme incomplet
   *
   * @param sessionId ID de la session
   * @returns Résultat de l'opération
   */
  markRecordIncomplete(sessionId: AggregateID): Promise<Result<OrchestratorResult>>;

  // OPERATIONS DE COMMUNICATION

  /**
   * Traite une réponse utilisateur
   *
   * @param sessionId ID de la session
   * @param messageId ID du message répondu
   * @param response Réponse de l'utilisateur
   * @param decisionData Données de décision additionnelles
   * @returns Résultat de l'opération
   */
  handleUserResponse(
    sessionId: AggregateID,
    messageId: AggregateID,
    response: string,
    decisionData?: Record<string, any>
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Récupère les messages en attente pour une session
   *
   * @param sessionId ID de la session
   * @returns Liste des messages en attente
   */
  getPendingMessages(sessionId: AggregateID): Promise<Result<Message[]>>;

  // OPERATIONS DE SURVEILLANCE

  /**
   * Récupère l'état actuel d'une session
   *
   * @param sessionId ID de la session
   * @returns État détaillé de la session
   */
  getSessionStatus(sessionId: AggregateID): Promise<Result<{
    session: PatientCareSession;
    currentRecord?: any;
    pendingItems?: any[];
    completionStatus?: string;
    nextActions?: OrchestratorOperation[];
  }>>;
}
