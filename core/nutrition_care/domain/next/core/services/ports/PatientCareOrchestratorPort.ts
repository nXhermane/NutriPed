import {
  AggregateID,
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
} from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import {
  DailyMonitoringTask,
  DailyCareAction,
  PatientCareSession,
  UserResponse,
  DailyCareRecord,
  DailyCareRecordStatus,
  Message,
  UserDecisionData,
} from "../../models";
import { IPatientCareOrchestratorPort } from "../../ports/primary/IPatientCareOrchestratorPort";
import {
  ContinuousEvaluationContext,
  IPatientCareOrchestratorService,
  OrchestratorContext,
  OrchestratorOperation,
  OrchestratorResult,
} from "../interfaces";
import { PatientCareSessionRepository } from "../../ports";

/**
 * IMPLÉMENTATION DU PORT ORCHESTRATEUR DE SOINS PATIENT
 *
 * Cette classe fournit une interface publique pour l'orchestration des soins patient.
 * Elle encapsule le service d'orchestration et fournit des méthodes de haut niveau
 * pour les cas d'utilisation courants.
 */
export class PatientCareOrchestratorPort
  implements IPatientCareOrchestratorPort
{
  constructor(
    private readonly orchestratorService: IPatientCareOrchestratorService,
    private readonly sessionRepository: PatientCareSessionRepository, // Repository pour persister les sessions,
    private readonly idGenerator: GenerateUniqueId
  ) {}

  // IMPLÉMENTATION DES MÉTHODES PRINCIPALES

  async orchestrate(
    session: PatientCareSession,
    operation: OrchestratorOperation,
    context?: OrchestratorContext
  ): Promise<Result<OrchestratorResult>> {
    return this.orchestratorService.orchestrate(session, operation, context);
  }

  async orchestrateWithContinuousEvaluation(
    session: PatientCareSession,
    context?: ContinuousEvaluationContext
  ): Promise<Result<OrchestratorResult>> {
    return await this.orchestratorService.orchestrateWithContinuousEvaluation(
      session,
      context
    );
  }

  // GESTION DES SESSIONS

  async initializePatientCareSession(
    patientId: AggregateID,
    phaseCode: CARE_PHASE_CODES,
    patientVariables?: Record<string, number>
  ): Promise<Result<PatientCareSession>> {
    try {
      // Créer une nouvelle session
      const session = PatientCareSession.create(
        { patientId },
        this.generateId()
      ).val;

      // Initialiser avec la phase
      const result = await this.orchestrate(
        session,
        OrchestratorOperation.INITIALIZE_SESSION,
        {
          phaseCode,
          patientVariables,
        }
      );
      if (result.isFailure) {
        return Result.fail(
          formatError(result, PatientCareOrchestratorPort.name)
        );
      }
      if (result.val.success) {
        // Persister la session si repository disponible
        if (this.sessionRepository) {
          await this.sessionRepository.save(result.val.session);
        }
        return Result.ok(result.val.session);
      }

      return Result.fail(
        `Échec d'initialisation de la session: ${result.val.message}`
      );
    } catch (e) {
      return handleError(e);
    }
  }

  async getPatientCareSession(
    sessionId: AggregateID
  ): Promise<Result<PatientCareSession>> {
    try {
      if (!this.sessionRepository) {
        throw new Error("Repository de sessions non configuré");
      }

      const session = await this.sessionRepository.getById(sessionId);
      if (!session) {
        throw new Error(`Session ${sessionId} non trouvée`);
      }

      return session;
    } catch (e) {
      return handleError(e);
    }
  }

  // OPÉRATIONS DE COMPLETION

  async completeAction(
    sessionId: AggregateID,
    actionId: AggregateID
  ): Promise<Result<OrchestratorResult>> {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      const resultRes = await this.orchestrate(
        sessionRes.val,
        OrchestratorOperation.COMPLETE_ACTION,
        { actionId }
      );
      if (resultRes.isFailure) {
        return Result.fail(
          formatError(resultRes, PatientCareOrchestratorPort.name)
        );
      }
      return resultRes;
    } catch (e) {
      return handleError(e);
    }
  }

  async completeTask(
    sessionId: AggregateID,
    taskId: AggregateID
  ): Promise<Result<OrchestratorResult>> {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      const resultRes = await this.orchestrate(
        sessionRes.val,
        OrchestratorOperation.COMPLETE_TASK,
        { taskId }
      );
      if (resultRes.isFailure) {
        return Result.fail(
          formatError(resultRes, PatientCareOrchestratorPort.name)
        );
      }
      return resultRes;
    } catch (e) {
      return handleError(e);
    }
  }

  async markActionIncomplete(
    sessionId: AggregateID,
    actionId: AggregateID
  ): Promise<Result<OrchestratorResult>> {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      const resultRes = await this.orchestrate(
        sessionRes.val,
        OrchestratorOperation.MARK_ACTION_INCOMPLETE,
        { actionId }
      );
      if (resultRes.isFailure) {
        return Result.fail(
          formatError(resultRes, PatientCareOrchestratorPort.name)
        );
      }
      return resultRes;
    } catch (e) {
      return handleError(e);
    }
  }

  async markTaskIncomplete(
    sessionId: AggregateID,
    taskId: AggregateID
  ): Promise<Result<OrchestratorResult>> {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      const resultRes = await this.orchestrate(
        sessionRes.val,
        OrchestratorOperation.MARK_TASK_INCOMPLETE,
        { taskId }
      );
      if (resultRes.isFailure) {
        return Result.fail(
          formatError(resultRes, PatientCareOrchestratorPort.name)
        );
      }
      return resultRes;
    } catch (e) {
      return handleError(e);
    }
  }

  async markRecordIncomplete(
    sessionId: AggregateID
  ): Promise<Result<OrchestratorResult>> {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      const resultRes = await this.orchestrate(
        sessionRes.val,
        OrchestratorOperation.MARK_RECORD_INCOMPLETE
      );
      if (resultRes.isFailure) {
        return Result.fail(
          formatError(resultRes, PatientCareOrchestratorPort.name)
        );
      }
      return resultRes;
    } catch (e) {
      return handleError(e);
    }
  }

  // COMMUNICATION UTILISATEUR

  async handleUserResponse(
    sessionId: AggregateID,
    messageId: AggregateID,
    response: string,
    decisionData?: UserDecisionData
  ): Promise<Result<OrchestratorResult>> {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      const userResponseRes = UserResponse.create({
        messageId,
        response,
        decisionData,
      });
      if (userResponseRes.isFailure) {
        return Result.fail(
          formatError(userResponseRes, PatientCareOrchestratorPort.name)
        );
      }
      const resultRes = await this.orchestrate(
        sessionRes.val,
        OrchestratorOperation.HANDLE_USER_RESPONSE,
        {
          userResponse: userResponseRes.val,
        }
      );
      if (resultRes.isFailure) {
        return Result.fail(
          formatError(resultRes, PatientCareOrchestratorPort.name)
        );
      }
      return resultRes;
    } catch (e) {
      return handleError(e);
    }
  }

  async getPendingMessages(sessionId: AggregateID): Promise<Result<Message[]>> {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      return Result.ok(sessionRes.val.getPendingMessages());
    } catch (e) {
      return handleError(e);
    }
  }

  // SURVEILLANCE ET MONITORING

  async getSessionStatus(sessionId: AggregateID): Promise<
    Result<{
      session: PatientCareSession;
      currentRecord: DailyCareRecord | null;
      pendingItems?: (DailyCareAction | DailyMonitoringTask)[];
      completionStatus?: DailyCareRecordStatus;
      nextActions?: OrchestratorOperation[];
    }>
  > {
    try {
      const sessionRes = await this.getPatientCareSession(sessionId);
      if (sessionRes.isFailure) {
        return Result.fail(
          formatError(sessionRes, PatientCareOrchestratorPort.name)
        );
      }
      const session = sessionRes.val;
      const currentRecord = session.getCurrentDailyRecord();

      let pendingItems: (DailyCareAction | DailyMonitoringTask)[] = [];
      let completionStatus = "UNKNOWN" as any;

      if (currentRecord) {
        const items = currentRecord.getPendingItems();
        pendingItems = [...items.actions, ...items.tasks];
        completionStatus = currentRecord.getStatus();
      }

      return Result.ok({
        session, // ceci n'est pas important n'on plus
        currentRecord, // ceic n'est pas important
        pendingItems,
        completionStatus,
        nextActions: this.determineNextActions(session),
      });
    } catch (e) {
      return handleError(e);
    }
  }

  // MÉTHODES UTILITAIRES PRIVÉES

  private generateId(): AggregateID {
    return this.idGenerator.generate().toValue();
  }

  private determineNextActions(
    session: PatientCareSession
  ): OrchestratorOperation[] {
    const actions: OrchestratorOperation[] = [];
    const currentRecord = session.getCurrentDailyRecord();

    if (!currentRecord) {
      actions.push(OrchestratorOperation.GENERATE_DAILY_PLAN);
      return actions;
    }

    if (currentRecord.isCompleted()) {
      actions.push(OrchestratorOperation.TRANSITION_PHASE);
    } else {
      actions.push(OrchestratorOperation.COMPLETE_DAILY_RECORD);
    }

    if (session.hasPendingMessages()) {
      actions.push(OrchestratorOperation.HANDLE_USER_RESPONSE);
    }

    return actions;
  }
}
