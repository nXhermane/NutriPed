import { AggregateID, DomainDateTime, Result } from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { PatientCareSession, Message, UserResponse } from "../../models";
import { OrchestratorOperation, OrchestratorResult } from "../PatientCareOrchestratorService";

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
    context?: {
      targetDate?: DomainDateTime;
      userResponse?: UserResponse;
      phaseCode?: CARE_PHASE_CODES;
      patientVariables?: Record<string, number>;
    }
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
    context?: {
      patientVariables?: Record<string, number>;
      maxIterations?: number;
    }
  ): Promise<Result<OrchestratorResult>>;
}

/**
 * Types utilitaires pour l'orchestration
 */
export type OrchestratorContext = {
  targetDate?: DomainDateTime;
  userResponse?: { messageId: AggregateID; response: string; decisionData?: any };
  phaseCode?: string;
  patientVariables?: Record<string, number>;
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
