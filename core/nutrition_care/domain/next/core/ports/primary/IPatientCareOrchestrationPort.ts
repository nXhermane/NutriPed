import { AggregateID, Result } from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { PatientCareSession } from "../../models";
import { OrchestratorOperation, OrchestratorResult } from "../../services";

/**
 * Port Primaire pour l'Orchestration des Soins Patients
 *
 * Définit l'interface que les use cases utilisent pour interagir
 * avec le domaine d'orchestration des soins nutritionnels.
 *
 * Ce port fait partie de l'architecture hexagonale et permet de
 * séparer la logique applicative (use cases) de la logique métier (domaine).
 */
export interface IPatientCareOrchestrationPort {

  /**
   * Initialise une nouvelle session de soin pour un patient
   * @param patientId Identifiant du patient
   * @param phaseCode Code de la phase initiale (optionnel)
   * @param patientVariables Variables du patient (poids, taille, âge, etc.)
   * @returns Résultat de l'initialisation
   */
  initializePatientCareSession(
    patientId: AggregateID,
    phaseCode?: CARE_PHASE_CODES,
    patientVariables?: Record<string, number>
  ): Promise<Result<PatientCareSession>>;

  /**
   * Orchestre automatiquement le workflow complet d'un patient
   * Gère automatiquement la génération des plans, les transitions de phase,
   * et la communication avec l'utilisateur médical
   *
   * @param session Session de soin existante
   * @param patientVariables Variables du patient (optionnel)
   * @param maxIterations Limite d'itérations pour éviter les boucles infinies
   * @returns Résultat de l'orchestration complète
   */
  orchestratePatientCareWorkflow(
    session: PatientCareSession,
    patientVariables?: Record<string, number>,
    maxIterations?: number
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Exécute une opération spécifique d'orchestration
   * @param session Session de soin
   * @param operation Opération à exécuter
   * @param context Contexte optionnel pour l'opération
   * @returns Résultat de l'opération
   */
  executeOrchestrationOperation(
    session: PatientCareSession,
    operation: OrchestratorOperation,
    context?: {
      targetDate?: Date;
      userResponse?: {
        messageId: AggregateID;
        response: string;
        decisionData?: Record<string, any>;
      };
      phaseCode?: CARE_PHASE_CODES;
      patientVariables?: Record<string, number>;
    }
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Synchronise l'état d'une session patient
   * Génère automatiquement tous les plans manqués depuis la dernière activité
   *
   * @param session Session à synchroniser
   * @param patientVariables Variables du patient (optionnel)
   * @returns Résultat de la synchronisation
   */
  synchronizePatientCareState(
    session: PatientCareSession,
    patientVariables?: Record<string, number>
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Traite une réponse utilisateur dans le contexte d'une session
   * @param session Session concernée
   * @param messageId ID du message répondu
   * @param response Réponse de l'utilisateur
   * @param decisionData Données de décision additionnelles
   * @returns Résultat du traitement
   */
  handleUserResponse(
    session: PatientCareSession,
    messageId: AggregateID,
    response: string,
    decisionData?: Record<string, any>
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Récupère les messages en attente pour une session
   * @param session Session concernée
   * @returns Liste des messages en attente
   */
  getPendingMessages(session: PatientCareSession): Promise<Result<Array<{
    id: AggregateID;
    type: string;
    content: string;
    requiresResponse: boolean;
    decisionType?: string;
  }>>>;

  /**
   * Vérifie si une session a des messages en attente
   * @param session Session à vérifier
   * @returns True si des messages sont en attente
   */
  hasPendingMessages(session: PatientCareSession): Promise<Result<boolean>>;

  /**
   * Récupère l'état actuel d'une session de soin
   * @param session Session concernée
   * @returns État détaillé de la session
   */
  getPatientCareSessionStatus(session: PatientCareSession): Promise<Result<{
    sessionId: AggregateID;
    patientId: AggregateID;
    status: string;
    currentPhase?: string;
    hasCurrentDailyRecord: boolean;
    pendingMessagesCount: number;
    lastActivity?: Date;
  }>>;
}

/**
 * Types utilitaires pour les ports primaires
 */
export type PatientCareInitializationRequest = {
  patientId: AggregateID;
  phaseCode?: CARE_PHASE_CODES;
  patientVariables?: Record<string, number>;
};

export type OrchestrationWorkflowRequest = {
  session: PatientCareSession;
  patientVariables?: Record<string, number>;
  maxIterations?: number;
};

export type OrchestrationOperationRequest = {
  session: PatientCareSession;
  operation: OrchestratorOperation;
  context?: {
    targetDate?: Date;
    userResponse?: {
      messageId: AggregateID;
      response: string;
      decisionData?: Record<string, any>;
    };
    phaseCode?: CARE_PHASE_CODES;
    patientVariables?: Record<string, number>;
  };
};

export type UserResponseRequest = {
  session: PatientCareSession;
  messageId: AggregateID;
  response: string;
  decisionData?: Record<string, any>;
};

export type SessionStatusResponse = {
  sessionId: AggregateID;
  patientId: AggregateID;
  status: string;
  currentPhase?: string;
  hasCurrentDailyRecord: boolean;
  pendingMessagesCount: number;
  lastActivity?: Date;
};
