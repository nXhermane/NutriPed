import { AggregateID, DomainDateTime, GenerateUniqueId } from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { PatientCareSession, UserResponse } from "../../models";
import { IPatientCareOrchestratorPort } from "../../ports/primary/IPatientCareOrchestratorPort";
import { IPatientCareOrchestratorService, OrchestratorOperation, OrchestratorResult } from "../interfaces";
import { PatientCareSessionRepository } from "../../ports";

/**
 * IMPLÉMENTATION DU PORT ORCHESTRATEUR DE SOINS PATIENT
 *
 * Cette classe fournit une interface publique pour l'orchestration des soins patient.
 * Elle encapsule le service d'orchestration et fournit des méthodes de haut niveau
 * pour les cas d'utilisation courants.
 */
export class PatientCareOrchestratorPort implements IPatientCareOrchestratorPort {

  constructor(
    private readonly orchestratorService: IPatientCareOrchestratorService,
    private readonly sessionRepository: PatientCareSessionRepository,// Repository pour persister les sessions,
    private readonly idGenerator: GenerateUniqueId
  ) { }

  // IMPLÉMENTATION DES MÉTHODES PRINCIPALES

  async orchestrate(
    session: PatientCareSession,
    operation: OrchestratorOperation,
    context?: {
      targetDate?: DomainDateTime;
      userResponse?: UserResponse;
      phaseCode?: CARE_PHASE_CODES;
      patientVariables?: Record<string, number>;
      actionId?: AggregateID;
      taskId?: AggregateID;
    }
  ): Promise<OrchestratorResult> {
    const result = await this.orchestratorService.orchestrate(session, operation, context);
    return result.val;
  }

  async orchestrateWithContinuousEvaluation(
    session: PatientCareSession,
    context?: {
      patientVariables?: Record<string, number>;
      maxIterations?: number;
    }
  ): Promise<OrchestratorResult> {
    const result = await this.orchestratorService.orchestrateWithContinuousEvaluation(session, context);
    return result.val;
  }

  // GESTION DES SESSIONS

  async initializePatientCareSession(
    patientId: AggregateID,
    phaseCode: CARE_PHASE_CODES,
    patientVariables?: Record<string, number>
  ): Promise<PatientCareSession> {
    // Créer une nouvelle session
    const session = PatientCareSession.create({ patientId }, this.generateId()).val;

    // Initialiser avec la phase
    const result = await this.orchestrate(session, OrchestratorOperation.INITIALIZE_SESSION, {
      phaseCode,
      patientVariables
    });

    if (result.success) {
      // Persister la session si repository disponible
      if (this.sessionRepository) {
        await this.sessionRepository.save(result.session);
      }
      return result.session;
    }

    throw new Error(`Échec d'initialisation de la session: ${result.message}`);
  }

  async getPatientCareSession(sessionId: AggregateID): Promise<PatientCareSession> {
    if (!this.sessionRepository) {
      throw new Error("Repository de sessions non configuré");
    }

    const session = await this.sessionRepository.getById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} non trouvée`);
    }

    return session;
  }

  // OPÉRATIONS DE COMPLETION

  async completeAction(
    sessionId: AggregateID,
    actionId: AggregateID
  ): Promise<OrchestratorResult> {
    const session = await this.getPatientCareSession(sessionId);
    return await this.orchestrate(session, OrchestratorOperation.COMPLETE_ACTION, { actionId });
  }

  async completeTask(
    sessionId: AggregateID,
    taskId: AggregateID
  ): Promise<OrchestratorResult> {
    const session = await this.getPatientCareSession(sessionId);
    return await this.orchestrate(session, OrchestratorOperation.COMPLETE_TASK, { taskId });
  }

  async markActionIncomplete(
    sessionId: AggregateID,
    actionId: AggregateID
  ): Promise<OrchestratorResult> {
    const session = await this.getPatientCareSession(sessionId);
    return await this.orchestrate(session, OrchestratorOperation.MARK_ACTION_INCOMPLETE, { actionId });
  }

  async markTaskIncomplete(
    sessionId: AggregateID,
    taskId: AggregateID
  ): Promise<OrchestratorResult> {
    const session = await this.getPatientCareSession(sessionId);
    return await this.orchestrate(session, OrchestratorOperation.MARK_TASK_INCOMPLETE, { taskId });
  }

  async markRecordIncomplete(sessionId: AggregateID): Promise<OrchestratorResult> {
    const session = await this.getPatientCareSession(sessionId);
    return await this.orchestrate(session, OrchestratorOperation.MARK_RECORD_INCOMPLETE);
  }

  // COMMUNICATION UTILISATEUR

  async handleUserResponse(
    sessionId: AggregateID,
    messageId: AggregateID,
    response: string,
    decisionData?: Record<string, any>
  ): Promise<OrchestratorResult> {
    const session = await this.getPatientCareSession(sessionId);

    return await this.orchestrate(session, OrchestratorOperation.HANDLE_USER_RESPONSE, {
      userResponse: {
        messageId,
        response,
        timestamp: DomainDateTime.now(),
        decisionData
      }
    });
  }

  async getPendingMessages(sessionId: AggregateID): Promise<any[]> {
    const session = await this.getPatientCareSession(sessionId);
    return session.getPendingMessages();
  }

  // SURVEILLANCE ET MONITORING

  async getSessionStatus(sessionId: AggregateID): Promise<{
    session: PatientCareSession;
    currentRecord?: any;
    pendingItems?: any[];
    completionStatus?: string;
    nextActions?: OrchestratorOperation[];
  }> {
    const session = await this.getPatientCareSession(sessionId);
    const currentRecord = session.getCurrentDailyRecord();

    let pendingItems: any[] = [];
    let completionStatus = "UNKNOWN";

    if (currentRecord) {
      const items = currentRecord.getPendingItems();
      pendingItems = [...items.actions, ...items.tasks];
      completionStatus = currentRecord.isCompleted() ? "COMPLETED" :
        currentRecord.isIncompleted() ? "INCOMPLETED" : "ACTIVE";
    }

    return {
      session,
      currentRecord,
      pendingItems,
      completionStatus,
      nextActions: this.determineNextActions(session)
    };
  }

  async getSessionHistory(
    sessionId: AggregateID,
    limit: number = 10
  ): Promise<OrchestratorResult[]> {
    // Cette méthode nécessiterait un repository d'historique
    // Pour l'instant, on retourne un tableau vide
    return [];
  }

  // MÉTHODES UTILITAIRES PRIVÉES

  private generateId(): AggregateID {
    return this.idGenerator.generate().toValue();
  }

  private determineNextActions(session: PatientCareSession): OrchestratorOperation[] {
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
