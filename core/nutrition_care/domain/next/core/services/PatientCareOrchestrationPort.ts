import { AggregateID, Result, DomainDateTime } from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { PatientCareSession, UserResponse } from "../models";
import {
  IPatientCareOrchestratorService,
  OrchestratorOperation,
  OrchestratorResult
} from ".";
import {
  IPatientCareOrchestrationPort,
  PatientCareInitializationRequest,
  OrchestrationWorkflowRequest,
  OrchestrationOperationRequest,
  UserResponseRequest,
  SessionStatusResponse
} from "../ports/primary/IPatientCareOrchestrationPort";

/**
 * Implémentation du Port Primaire pour l'Orchestration des Soins Patients
 *
 * Ce service fait le lien entre les use cases (couche application)
 * et le domaine d'orchestration des soins nutritionnels.
 *
 * Il adapte les appels des use cases vers le domaine et transforme
 * les résultats du domaine en format adapté à l'application.
 */
export class PatientCareOrchestrationPort implements IPatientCareOrchestrationPort {

  constructor(
    private readonly orchestrator: IPatientCareOrchestratorService
  ) {}

  /**
   * Initialise une nouvelle session de soin pour un patient
   */
  async initializePatientCareSession(
    patientId: AggregateID,
    phaseCode?: CARE_PHASE_CODES,
    patientVariables?: Record<string, number>
  ): Promise<Result<PatientCareSession>> {
    try {
      // Créer la session
      const sessionResult = PatientCareSession.create(
        { patientId },
        `${patientId}_session_${Date.now()}`
      );

      if (sessionResult.isFailure) {
        return Result.fail("Échec création session");
      }

      const session = sessionResult.val;

      // Initialiser l'orchestration
      const initResult = await this.orchestrator.orchestrate(
        session,
        OrchestratorOperation.INITIALIZE_SESSION,
        {
          phaseCode,
          patientVariables
        }
      );

      if (initResult.isFailure) {
        return Result.fail("Échec initialisation orchestration");
      }

      // Retourner la session mise à jour
      return Result.ok(initResult.val.session);

    } catch (error) {
      return Result.fail(`Erreur lors de l'initialisation: ${error}`);
    }
  }

  /**
   * Orchestre automatiquement le workflow complet d'un patient
   */
  async orchestratePatientCareWorkflow(
    session: PatientCareSession,
    patientVariables?: Record<string, number>,
    maxIterations?: number
  ): Promise<Result<OrchestratorResult>> {
    try {
      const result = await this.orchestrator.orchestrateWithContinuousEvaluation(
        session,
        {
          patientVariables,
          maxIterations
        }
      );

      if (result.isFailure) {
        return Result.fail("Échec orchestration workflow");
      }

      return result;

    } catch (error) {
      return Result.fail(`Erreur lors de l'orchestration: ${error}`);
    }
  }

  /**
   * Exécute une opération spécifique d'orchestration
   */
  async executeOrchestrationOperation(
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
  ): Promise<Result<OrchestratorResult>> {
    try {
      // Adapter le contexte pour le domaine
      const domainContext = context ? {
        targetDate: context.targetDate ? DomainDateTime.create(context.targetDate).val : undefined,
        userResponse: context.userResponse ? {
          messageId: context.userResponse.messageId,
          response: context.userResponse.response,
          timestamp: DomainDateTime.now(),
          decisionData: context.userResponse.decisionData
        } : undefined,
        phaseCode: context.phaseCode as CARE_PHASE_CODES,
        patientVariables: context.patientVariables
      } : undefined;

      const result = await this.orchestrator.orchestrate(
        session,
        operation,
        domainContext
      );

      if (result.isFailure) {
        return Result.fail(`Échec exécution opération ${operation}`);
      }

      return result;

    } catch (error) {
      return Result.fail(`Erreur lors de l'exécution de ${operation}: ${error}`);
    }
  }

  /**
   * Synchronise l'état d'une session patient
   */
  async synchronizePatientCareState(
    session: PatientCareSession,
    patientVariables?: Record<string, number>
  ): Promise<Result<OrchestratorResult>> {
    try {
      const result = await this.orchestrator.orchestrate(
        session,
        OrchestratorOperation.SYNCHRONIZE_STATE,
        {
          patientVariables
        }
      );

      if (result.isFailure) {
        return Result.fail("Échec synchronisation état");
      }

      return result;

    } catch (error) {
      return Result.fail(`Erreur lors de la synchronisation: ${error}`);
    }
  }

  /**
   * Traite une réponse utilisateur dans le contexte d'une session
   */
  async handleUserResponse(
    session: PatientCareSession,
    messageId: AggregateID,
    response: string,
    decisionData?: Record<string, any>
  ): Promise<Result<OrchestratorResult>> {
    try {
      const result = await this.orchestrator.orchestrate(
        session,
        OrchestratorOperation.HANDLE_USER_RESPONSE,
        {
          userResponse: {
            messageId,
            response,
            timestamp: DomainDateTime.now(),
            decisionData
          }
        }
      );

      if (result.isFailure) {
        return Result.fail("Échec traitement réponse utilisateur");
      }

      return result;

    } catch (error) {
      return Result.fail(`Erreur lors du traitement de la réponse: ${error}`);
    }
  }

  /**
   * Récupère les messages en attente pour une session
   */
  async getPendingMessages(session: PatientCareSession): Promise<Result<Array<{
    id: AggregateID;
    type: string;
    content: string;
    requiresResponse: boolean;
    decisionType?: string;
  }>>> {
    try {
      const messages = session.getPendingMessages();

      // Adapter le format pour l'application
      const adaptedMessages = messages.map(message => ({
        id: message.id,
        type: message.type,
        content: message.content,
        requiresResponse: message.requiresResponse,
        decisionType: message.decisionType
      }));

      return Result.ok(adaptedMessages);

    } catch (error) {
      return Result.fail(`Erreur récupération messages: ${error}`);
    }
  }

  /**
   * Vérifie si une session a des messages en attente
   */
  async hasPendingMessages(session: PatientCareSession): Promise<Result<boolean>> {
    try {
      const hasPending = session.hasPendingMessages();
      return Result.ok(hasPending);

    } catch (error) {
      return Result.fail(`Erreur vérification messages en attente: ${error}`);
    }
  }

  /**
   * Récupère l'état actuel d'une session de soin
   */
  async getPatientCareSessionStatus(session: PatientCareSession): Promise<Result<SessionStatusResponse>> {
    try {
      const status: SessionStatusResponse = {
        sessionId: session.getID(),
        patientId: session.getPatientId(),
        status: session.getStatus(),
        currentPhase: session.getCurrentPhase()?.getCode(),
        hasCurrentDailyRecord: session.getCurrentDailyRecord() !== null,
        pendingMessagesCount: session.getPendingMessages().length,
        lastActivity: new Date() // TODO: Implémenter le suivi de dernière activité
      };

      return Result.ok(status);

    } catch (error) {
      return Result.fail(`Erreur récupération statut session: ${error}`);
    }
  }
}

/**
 * Factory pour créer l'implémentation du port primaire
 */
export class PatientCareOrchestrationPortFactory {
  static create(orchestrator: IPatientCareOrchestratorService): IPatientCareOrchestrationPort {
    return new PatientCareOrchestrationPort(orchestrator);
  }
}
