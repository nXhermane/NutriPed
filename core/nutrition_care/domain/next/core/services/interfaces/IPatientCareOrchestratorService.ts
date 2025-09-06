import { AggregateID, DomainDateTime, Result } from "@/core/shared";
import { PatientCareSession, UserResponse } from "../../models";
import { CARE_PHASE_CODES } from "@/core/constants";

export enum OrchestratorOperation {
  INITIALIZE_SESSION = "INITIALIZE_SESSION",
  GENERATE_DAILY_PLAN = "GENERATE_DAILY_PLAN",
  UPDATE_DAILY_PLAN = "UPDATE_DAILY_PLAN",
  COMPLETE_DAILY_RECORD = "COMPLETE_DAILY_RECORD",
  TRANSITION_PHASE = "TRANSITION_PHASE",
  HANDLE_USER_RESPONSE = "HANDLE_USER_RESPONSE",
  SYNCHRONIZE_STATE = "SYNCHRONIZE_STATE",
  // Nouvelles opérations pour la completion
  COMPLETE_ACTION = "COMPLETE_ACTION",
  COMPLETE_TASK = "COMPLETE_TASK",
  MARK_ACTION_INCOMPLETE = "MARK_ACTION_INCOMPLETE",
  MARK_TASK_INCOMPLETE = "MARK_TASK_INCOMPLETE",
  MARK_RECORD_INCOMPLETE = "MARK_RECORD_INCOMPLETE",
}

export interface OrchestratorResult {
  success: boolean;
  operation: OrchestratorOperation;
  session: PatientCareSession;
  message?: string;
  requiresUserAction?: boolean;
  nextOperation?: OrchestratorOperation;
}

/**
 * Interface pour le service d'orchestration des soins patients
 * Définit le contrat pour la gestion complète du cycle de vie des soins nutritionnels
 */
export interface IPatientCareOrchestratorService {

  /**
   * Point d'entrée principal - Orchestre toutes les opérations
   * @param session Session de soin patient
   * @param operation Opération à exécuter
   * @param context Contexte optionnel pour l'opération
   * @returns Résultat de l'orchestration
   */
  orchestrate(
    session: PatientCareSession,
    operation: OrchestratorOperation,
    context?: OrchestratorContext
  ): Promise<Result<OrchestratorResult>>;

  /**
   * Orchestration automatique avec boucle d'évaluation continue
   * Gère automatiquement le cycle complet :
   * - Génération de daily plans jusqu'à aujourd'hui
   * - Évaluation continue de l'état du patient
   * - Gestion des transitions de phase
   * - Arrêt automatique si messages en attente
   *
   * @param session Session de soin patient
   * @param context Contexte avec variables patient et limite d'itérations
   * @returns Résultat de l'orchestration complète
   */
  orchestrateWithContinuousEvaluation(
    session: PatientCareSession,
    context?: ContinuousEvaluationContext
  ): Promise<Result<OrchestratorResult>>;
}

/**
 * Types utilitaires pour l'orchestration
 */
export type OrchestratorContext = {
  targetDate?: DomainDateTime;
  userResponse?: UserResponse;
  phaseCode?: CARE_PHASE_CODES;
  patientVariables?: Record<string, number>;
  actionId?: AggregateID;
  taskId?: AggregateID;
};

export type ContinuousEvaluationContext = {
  patientVariables?: Record<string, number>;
  maxIterations?: number;
};

/**
 * Résultat d'une opération d'orchestration
 */
export type OrchestratorOperationResult = {
  success: boolean;
  operation: OrchestratorOperation;
  session: PatientCareSession;
  message?: string;
  requiresUserAction?: boolean;
  nextOperation?: OrchestratorOperation;
};

/**
 * États possibles de l'orchestrateur
 */
export enum OrchestratorState {
  IDLE = "IDLE",
  PROCESSING = "PROCESSING",
  WAITING_FOR_USER = "WAITING_FOR_USER",
  COMPLETED = "COMPLETED",
  ERROR = "ERROR"
}

/**
 * Contexte d'exécution pour le débogage et la traçabilité
 */
export type OrchestratorExecutionContext = {
  sessionId: string;
  patientId: string;
  currentOperation: OrchestratorOperation;
  startTime: DomainDateTime;
  iterationCount?: number;
  state: OrchestratorState;
  lastMessage?: string;
  pendingMessagesCount: number;
};
