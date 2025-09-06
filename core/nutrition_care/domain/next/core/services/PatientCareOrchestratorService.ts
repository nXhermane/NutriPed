import {
  AggregateID,
  DomainDateTime,
  formatError,
  GenerateUniqueId,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { PatientCareSession, UserResponse } from "../models";
import {
  ICarePhaseDailyCareRecordManager,
  ICarePhaseManagerService,
  IDailyPlanApplicatorService,
  IPatientCareOrchestratorService,
} from "./interfaces";
import { CarePhaseDecision } from "@/core/nutrition_care/domain/modules";

export enum OrchestratorOperation {
  INITIALIZE_SESSION = "INITIALIZE_SESSION",
  GENERATE_DAILY_PLAN = "GENERATE_DAILY_PLAN",
  UPDATE_DAILY_PLAN = "UPDATE_DAILY_PLAN",
  COMPLETE_DAILY_RECORD = "COMPLETE_DAILY_RECORD",
  TRANSITION_PHASE = "TRANSITION_PHASE",
  HANDLE_USER_RESPONSE = "HANDLE_USER_RESPONSE",
  SYNCHRONIZE_STATE = "SYNCHRONIZE_STATE",
}

export interface OrchestratorResult {
  success: boolean;
  operation: OrchestratorOperation;
  session: PatientCareSession;
  message?: string;
  requiresUserAction?: boolean;
  nextOperation?: OrchestratorOperation;
}

export class PatientCareOrchestratorService implements IPatientCareOrchestratorService {
  constructor(
    private readonly carePhaseManager: ICarePhaseManagerService,
    private readonly dailyCareManager: ICarePhaseDailyCareRecordManager  ) {}

  /**
   * Point d'entrée principal - Orchestre toutes les opérations
   */
  async orchestrate(
    session: PatientCareSession,
    operation: OrchestratorOperation,
    context?: {
      targetDate?: DomainDateTime;
      userResponse?: UserResponse;
      phaseCode?: CARE_PHASE_CODES;
      patientVariables?: Record<string, number>;
    }
  ): Promise<Result<OrchestratorResult>> {
    try {
      // Vérifier l'état de la session avant toute opération
      const stateCheck = this.validateSessionState(session);
      if (stateCheck.isFailure) {
        return Result.fail(formatError(stateCheck, PatientCareOrchestratorService.name));
      }

      switch (operation) {
        case OrchestratorOperation.INITIALIZE_SESSION:
          return await this.initializeSession(session, context);

        case OrchestratorOperation.GENERATE_DAILY_PLAN:
          return await this.generateDailyPlan(session, context);

        case OrchestratorOperation.UPDATE_DAILY_PLAN:
          return await this.updateDailyPlan(session, context);

        case OrchestratorOperation.COMPLETE_DAILY_RECORD:
          return await this.completeDailyRecord(session, context);

        case OrchestratorOperation.TRANSITION_PHASE:
          return await this.transitionPhase(session, context);

        case OrchestratorOperation.HANDLE_USER_RESPONSE:
          return await this.handleUserResponse(session, context);

        case OrchestratorOperation.SYNCHRONIZE_STATE:
          return await this.synchronizeState(session, context);

        default:
          return Result.fail(`Unknown operation: ${operation}`);
      }
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Orchestration automatique avec boucle d'évaluation continue
   * Cette méthode gère automatiquement le cycle complet :
   * - Génération de daily plans jusqu'à aujourd'hui
   * - Évaluation continue de l'état du patient
   * - Gestion des transitions de phase
   * - Arrêt automatique si messages en attente
   */
  async orchestrateWithContinuousEvaluation(
    session: PatientCareSession,
    context?: {
      patientVariables?: Record<string, number>;
      maxIterations?: number; // Protection contre les boucles infinies
    }
  ): Promise<Result<OrchestratorResult>> {
    try {
      const maxIterations = context?.maxIterations || 100;
      let iterationCount = 0;
      let currentOperation: OrchestratorOperation = OrchestratorOperation.SYNCHRONIZE_STATE;

      // Boucle principale d'orchestration
      while (iterationCount < maxIterations) {
        iterationCount++;

        // Vérifier si la session a des messages en attente
        if (session.hasPendingMessages()) {
          return Result.ok({
            success: true,
            operation: currentOperation,
            session,
            message: "Orchestration interrompue - réponse utilisateur requise",
            requiresUserAction: true,
            nextOperation: OrchestratorOperation.HANDLE_USER_RESPONSE
          });
        }

        // Exécuter l'opération courante
        const result = await this.orchestrate(session, currentOperation, {
          patientVariables: context?.patientVariables
        });

        if (result.isFailure) {
          return result;
        }

        const orchestratorResult = result.val;
        session = orchestratorResult.session;

        // Si l'opération nécessite une action utilisateur, s'arrêter
        if (orchestratorResult.requiresUserAction) {
          return Result.ok({
            ...orchestratorResult,
            message: `${orchestratorResult.message} - Arrêt pour réponse utilisateur`
          });
        }

        // Déterminer la prochaine opération
        currentOperation = orchestratorResult.nextOperation || OrchestratorOperation.SYNCHRONIZE_STATE;

        // Condition d'arrêt : si on revient à SYNCHRONIZE_STATE sans progression
        if (currentOperation === OrchestratorOperation.SYNCHRONIZE_STATE && iterationCount > 1) {
          // Vérifier si on a fait du progrès
          const currentRecord = session.getCurrentDailyRecord();
          const today = DomainDateTime.now();

          if (currentRecord) {
            const recordDate = DomainDateTime.create(currentRecord.getDate()).val;
            if (recordDate.isSameDay(today)) {
              // On a rattrapé le présent, arrêter
              break;
            }
          }
        }
      }

      if (iterationCount >= maxIterations) {
        return Result.fail("Limite d'itérations atteinte - possible boucle infinie");
      }

      return Result.ok({
        success: true,
        operation: currentOperation,
        session,
        message: `Orchestration terminée après ${iterationCount} itérations`,
        nextOperation: OrchestratorOperation.SYNCHRONIZE_STATE
      });

    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Initialise une nouvelle session de soin
   */
  private async initializeSession(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      // Validation: s'assurer que currentPhase est null
      if (session.getCurrentPhase() !== null) {
        return Result.fail("Session déjà initialisée - phase existante détectée");
      }

      // Créer le code de phase avec SystemCode
      const phaseCodeValue = context?.phaseCode || "INITIAL_ASSESSMENT";
      const phaseCodeResult = SystemCode.create(phaseCodeValue);

      if (phaseCodeResult.isFailure) {
        return Result.fail(formatError(phaseCodeResult, PatientCareOrchestratorService.name));
      }

      const patientId = session.getPatientId();

      const phaseResult = await this.carePhaseManager.generate(
        phaseCodeResult.val,
        patientId
      );

      if (phaseResult.isFailure) {
        return Result.fail(formatError(phaseResult, PatientCareOrchestratorService.name));
      }

      // Transition vers la nouvelle phase
      session.transitionToNewPhase(phaseResult.val);

      // Générer le premier daily plan avec now (pas de current record)
      const dailyPlanResult = await this.generateDailyPlan(session, {
        targetDate: DomainDateTime.now(),
        patientVariables: context?.patientVariables
      });

      if (dailyPlanResult.isFailure) {
        return Result.fail(formatError(dailyPlanResult, PatientCareOrchestratorService.name));
      }

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.INITIALIZE_SESSION,
        session,
        message: "Session de soin initialisée avec succès",
        nextOperation: OrchestratorOperation.GENERATE_DAILY_PLAN
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Génère un plan de soin quotidien
   */
  private async generateDailyPlan(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentPhase = session.getCurrentPhase();
      if (!currentPhase) {
        return Result.fail("Aucune phase active dans la session");
      }

      const targetDate = context?.targetDate || DomainDateTime.now();
      const patientId = session.getPatientId();

      // Générer le daily care record
      const dailyRecordResult = await this.dailyCareManager.generateDailyCareRecord(
        currentPhase,
        patientId,
        targetDate,
        context?.patientVariables
      );

      if (dailyRecordResult.isFailure) {
        return Result.fail(formatError(dailyRecordResult, PatientCareOrchestratorService.name));
      }

      // Mettre à jour la session
      session.updateCurrentDailyRecord(dailyRecordResult.val);

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.GENERATE_DAILY_PLAN,
        session,
        message: `Plan de soin généré pour le ${targetDate.toString()}`,
        nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Met à jour un plan de soin existant
   */
  private async updateDailyPlan(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentPhase = session.getCurrentPhase();
      const currentRecord = session.getCurrentDailyRecord();

      if (!currentPhase || !currentRecord) {
        return Result.fail("Phase ou record quotidien manquant");
      }

      const patientId = session.getPatientId();
      const targetDate = context?.targetDate || DomainDateTime.now();

      // Mettre à jour le record existant
      const updateResult = await this.dailyCareManager.updateExistingDailyCareRecord(
        currentPhase,
        currentRecord,
        patientId,
        targetDate,
      );

      if (updateResult.isFailure) {
        return Result.fail(formatError(updateResult, PatientCareOrchestratorService.name));
      }

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.UPDATE_DAILY_PLAN,
        session,
        message: "Plan de soin mis à jour avec succès",
        nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Marque les actions/tasks comme terminées et évalue le record
   */
  private async completeDailyRecord(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        return Result.fail("Aucun record quotidien actif");
      }

      // Évaluer l'état des actions et tasks
      const pendingItems = currentRecord.getPendingItems();
      const isCompleted = currentRecord.isCompleted();

      // Si le record est terminé, préparer la transition
      if (isCompleted) {
        // Archiver le record actuel
        session.updateCurrentDailyRecord(currentRecord);

        return Result.ok({
          success: true,
          operation: OrchestratorOperation.COMPLETE_DAILY_RECORD,
          session,
          message: "Record quotidien terminé",
          nextOperation: OrchestratorOperation.TRANSITION_PHASE
        });
      } else {
        // Préparer le message pour les items non terminés
        const pendingCount = pendingItems.actions.length + pendingItems.tasks.length;
        session.notifyMissingVariables([
          `${pendingCount} items non terminés`
        ]);

        return Result.ok({
          success: true,
          operation: OrchestratorOperation.COMPLETE_DAILY_RECORD,
          session,
          message: `${pendingCount} items restent à compléter`,
          requiresUserAction: true,
          nextOperation: OrchestratorOperation.HANDLE_USER_RESPONSE
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Gère les transitions de phase
   */
  private async transitionPhase(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentPhase = session.getCurrentPhase();
      if (!currentPhase) {
        return Result.fail("Aucune phase active");
      }

      const patientId = session.getPatientId();

      // Évaluer la phase actuelle
      const evaluationResult = await this.carePhaseManager.evaluate(
        currentPhase,
        patientId,
        DomainDateTime.now()
      );

      if (evaluationResult.isFailure) {
        return Result.fail(formatError(evaluationResult, PatientCareOrchestratorService.name));
      }

      const evaluation = evaluationResult.val;

      if (evaluation.decision === CarePhaseDecision.CONTINUE) {
        // Générer le prochain daily plan
        return await this.generateDailyPlan(session, context);
      } else {
        // Transition de phase requise
        const targetPhase = (evaluation as any).tragetPhase || (evaluation as any).targetPhase;

        return Result.ok({
          success: true,
          operation: OrchestratorOperation.TRANSITION_PHASE,
          session,
          message: `Transition requise vers ${targetPhase}`,
          requiresUserAction: true,
          nextOperation: OrchestratorOperation.HANDLE_USER_RESPONSE
        });
      }
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Gère les réponses utilisateur
   */
  private async handleUserResponse(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      if (!context?.userResponse) {
        return Result.fail("Aucune réponse utilisateur fournie");
      }

      const { messageId, response, decisionData } = context.userResponse;

      // Traiter la réponse
      const success = session.receiveUserResponse(messageId, response, decisionData);

      if (!success) {
        return Result.fail("Échec du traitement de la réponse utilisateur");
      }

      // Déterminer la prochaine opération basée sur le type de réponse
      const nextOperation = this.determineNextOperation(session, decisionData);

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.HANDLE_USER_RESPONSE,
        session,
        message: "Réponse utilisateur traitée",
        nextOperation
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Synchronise l'état de la session (rejeu automatique)
   */
  private async synchronizeState(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      const today = DomainDateTime.now();

      if (!currentRecord) {
        // Pas de record actif, générer le plan du jour
        return await this.generateDailyPlan(session, { targetDate: today, ...context });
      }

      const recordDate = DomainDateTime.create(currentRecord.getDate()).val;

      if (recordDate.isSameDay(today)) {
        // Record déjà à jour
        return Result.ok({
          success: true,
          operation: OrchestratorOperation.SYNCHRONIZE_STATE,
          session,
          message: "État synchronisé - record à jour",
          nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
        });
      }

      if (recordDate.isBefore(today)) {
        // Record ancien - rejeu nécessaire
        let currentDate = recordDate.addDays(1);

        while (currentDate.isBefore(today) || currentDate.isSameDay(today)) {
          const dailyPlanResult = await this.generateDailyPlan(session, {
            targetDate: currentDate,
            ...context
          });

          if (dailyPlanResult.isFailure) {
            return Result.fail(formatError(dailyPlanResult, PatientCareOrchestratorService.name));
          }

          currentDate = currentDate.addDays(1);
        }

        return Result.ok({
          success: true,
          operation: OrchestratorOperation.SYNCHRONIZE_STATE,
          session,
          message: "État synchronisé - rejeu terminé",
          nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
        });
      }

      // Record dans le futur - anomalie
      return Result.fail("Record quotidien dans le futur détecté");
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Valide l'état de la session avant les opérations
   */
  private validateSessionState(session: PatientCareSession): Result<void> {
    try {
      // Vérifier les messages en attente
      if (session.hasPendingMessages()) {
        return Result.fail("Messages en attente de réponse utilisateur");
      }

      // Vérifier la cohérence des dates
      const currentRecord = session.getCurrentDailyRecord();
      if (currentRecord) {
        const recordDate = DomainDateTime.create(currentRecord.getDate()).val;
        const today = DomainDateTime.now();

        if (recordDate.isAfter(today)) {
          return Result.fail("Record quotidien dans le futur");
        }
      }

      return Result.ok(undefined);
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Détermine la prochaine opération basée sur la réponse utilisateur
   */
  private determineNextOperation(
    session: PatientCareSession,
    decisionData?: any
  ): OrchestratorOperation {
    if (!decisionData) {
      return OrchestratorOperation.SYNCHRONIZE_STATE;
    }

    // Logique de décision basée sur le type de réponse
    switch (decisionData.type) {
      case "PHASE_TRANSITION":
        return OrchestratorOperation.TRANSITION_PHASE;
      case "TREATMENT_ADJUSTMENT":
        return OrchestratorOperation.UPDATE_DAILY_PLAN;
      case "VARIABLE_PROVISION":
        return OrchestratorOperation.GENERATE_DAILY_PLAN;
      default:
        return OrchestratorOperation.SYNCHRONIZE_STATE;
    }
  }
}
