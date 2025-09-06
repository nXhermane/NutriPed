/**
 * PATIENT CARE ORCHESTRATOR SERVICE
 *
 * Service d'orchestration complet pour la gestion des soins patient avec
 * système de completion automatique des actions et tâches.
 *
 * FONCTIONNALITÉS PRINCIPALES :
 * ==============================
 *
 * 1. INITIALISATION & SYNCHRONISATION
 *    - Création de sessions de soin
 *    - Génération automatique de daily plans
 *    - Rejeu des jours passés
 *
 * 2. GESTION DE LA COMPLETION (NOUVEAU)
 *    - Statut INCOMPLETED pour les daily care records
 *    - Règles temporelles de completion :
 *      • Actions : Seulement après effectiveDate
 *      • Tâches : À n'importe quel moment
 *      • Records : INCOMPLETED seulement pour jours passés
 *    - Notifications intelligentes selon le contexte
 *
 * 3. ORCHESTRATION AUTOMATIQUE
 *    - Boucle d'évaluation continue
 *    - Gestion des transitions de phase
 *    - Arrêt intelligent si réponse utilisateur requise
 *
 * 4. COMMUNICATION UTILISATEUR
 *    - Messages avec/sans réponse requise
 *    - Gestion des réponses de completion
 *    - Support des décisions multiples
 *
 * ARCHITECTURE :
 * ==============
 *
 * ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
 * │   Application   │ -> │      Port       │ -> │    Service      │
 * │   (Contrôleurs) │    │ (Interface)     │    │ (Orchestration) │
 * └─────────────────┘    └─────────────────┘    └─────────────────┘
 *          │                        │                        │
 *          ▼                        ▼                        ▼
 * ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
 * │   Exemples      │    │   Domain        │    │   Entities      │
 * │ (Utilisation)   │    │   Models        │    │ (Records)       │
 * └─────────────────┘    └─────────────────┘    └─────────────────┘
 *
 * WORKFLOW COMPLETION :
 * ====================
 *
 * 1. GÉNÉRATION RECORD
 *    └── DailyCareRecord avec actions/tasks
 *
 * 2. VÉRIFICATION AUTOMATIQUE (dans boucle)
 *    ├── Record terminé ? → Continuer orchestration
 *    ├── Aujourd'hui + items en attente ?
 *    │   └── Message + réponse requise → Arrêt orchestration
 *    └── Jour passé + items en attente ?
 *        └── Marquage incomplet + notification → Continuer
 *
 * 3. RÉPONSE UTILISATEUR
 *    ├── Compléter items spécifiques
 *    ├── Marquer incomplet
 *    └── Compléter automatiquement
 *
 * 4. FINALISATION
 *    └── Record complet → Transition phase
 *
 * UTILISATION :
 * ============
 *
 * ```typescript
 * // Via le port (recommandé)
 * const orchestrator = PatientCareOrchestratorPortFactory.create(
 *   carePhaseManager,
 *   dailyCareManager
 * );
 *
 * // Orchestration automatique
 * const result = await orchestrator.orchestrateWithContinuousEvaluation(session);
 *
 * // Completion manuelle
 * await orchestrator.completeAction(sessionId, actionId);
 * ```
 */

import {
  AggregateID,
  DomainDateTime,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { PatientCareSession, UserResponse, MessageType, DecisionType } from "../models";
import {
  ICarePhaseDailyCareRecordManager,
  ICarePhaseManagerService,
  IPatientCareOrchestratorService,
  OrchestratorOperation,
  OrchestratorResult,
} from "./interfaces";
import { CarePhaseDecision } from "@/core/nutrition_care/domain/modules";



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
      actionId?: AggregateID;
      taskId?: AggregateID;
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

        // Nouvelles opérations pour la completion
        case OrchestratorOperation.COMPLETE_ACTION:
          return await this.completeAction(session, context);

        case OrchestratorOperation.COMPLETE_TASK:
          return await this.completeTask(session, context);

        case OrchestratorOperation.MARK_ACTION_INCOMPLETE:
          return await this.markActionIncomplete(session, context);

        case OrchestratorOperation.MARK_TASK_INCOMPLETE:
          return await this.markTaskIncomplete(session, context);

        case OrchestratorOperation.MARK_RECORD_INCOMPLETE:
          return await this.markRecordIncomplete(session, context);

        default:
          return Result.fail(`Unknown operation: ${operation}`);
      }
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Orchestration automatique avec boucle d'évaluation continue
   *
   * Cette méthode gère automatiquement le cycle complet du système de soin :
   *
   * 1. INITIALISATION & SYNCHRONISATION
   *    - Génération de daily plans jusqu'à aujourd'hui
   *    - Rejeu automatique des jours passés
   *    - Synchronisation de l'état du patient
   *
   * 2. ÉVALUATION CONTINUE
   *    - Évaluation de l'état du patient
   *    - Gestion des transitions de phase automatiques
   *    - Adaptation des traitements selon les variables patient
   *
   * 3. GESTION DE LA COMPLETION (NOUVEAU)
   *    - Vérification automatique de la completion des actions/tâches
   *    - Application des règles temporelles de completion :
   *      • Aujourd'hui + items en attente = Message avec réponse requise
   *      • Jour passé + items en attente = Marquage automatique incomplet
   *      • Jour passé + tout terminé = Marquage automatique complet
   *    - Notifications intelligentes selon le contexte
   *
   * 4. INTERACTION UTILISATEUR
   *    - Arrêt automatique si messages en attente de réponse
   *    - Gestion des réponses utilisateur pour la completion
   *    - Support des décisions de completion (compléter, marquer incomplet, etc.)
   *
   * 5. SÉCURITÉ & PERFORMANCE
   *    - Protection contre les boucles infinies (maxIterations)
   *    - Validation d'état avant chaque opération
   *    - Gestion d'erreurs complète avec logging
   *
   * WORKFLOW COMPLETION :
   * ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   * │   Record avec   │ -> │ Vérification    │ -> │ Application des │
   * │ items en attente │    │ règles          │    │ règles          │
   * └─────────────────┘    └─────────────────┘    └─────────────────┘
   *          │                        │                        │
   *          ▼                        ▼                        ▼
   * ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   * │ Aujourd'hui     │ -> │ Message +       │ -> │ Attente réponse │
   * │                 │    │ réponse requise │    │ utilisateur     │
   * └─────────────────┘    └─────────────────┘    └─────────────────┘
   *          │                        │                        │
   *          ▼                        ▼                        ▼
   * ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
   * │ Jour passé      │ -> │ Marquage auto   │ -> │ Notification    │
   * │                 │    │ incomplet       │    │ simple          │
   * └─────────────────┘    └─────────────────┘    └─────────────────┘
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

        // LOGIQUE DE COMPLETION INTÉGRÉE DANS LA BOUCLE
        const completionCheck = await this.checkAndHandleRecordCompletion(session);
        if (completionCheck.isFailure) {
          return completionCheck;
        }

        const completionResult = completionCheck.val;
        if (completionResult.requiresUserAction) {
          return Result.ok({
            ...completionResult,
            message: `${completionResult.message} - Notification de completion`,
            operation: currentOperation
          });
        }

        session = completionResult.session;

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
      const phaseCodeValue = context?.phaseCode || ""; // Pour que le empty string puisse entrainer le failure du code. sinon on ne peut pas supposer de phase de traitement
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
        const targetPhase = (evaluation as any).tragetPhase;

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

      // Gérer les réponses liées à la completion
      if (decisionData?.type === "COMPLETION_RESPONSE") {
        return await this.handleCompletionResponse(session, decisionData);
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
   * Gère spécifiquement les réponses liées à la completion
   */
  private async handleCompletionResponse(
    session: PatientCareSession,
    decisionData: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        return Result.fail("Aucun record quotidien actif");
      }

      const { action, completionChoice, itemIds } = decisionData;

      switch (action) {
        case "COMPLETE_ITEMS":
          // L'utilisateur veut compléter les items spécifiés
          if (itemIds && Array.isArray(itemIds)) {
            for (const itemId of itemIds) {
              if (itemId.type === "action") {
                await this.completeAction(session, { actionId: itemId.id });
              } else if (itemId.type === "task") {
                await this.completeTask(session, { taskId: itemId.id });
              }
            }
          }
          break;

        case "MARK_INCOMPLETE":
          // L'utilisateur veut marquer le record comme incomplet
          currentRecord.markAsIncompleted();
          break;

        case "COMPLETE_ALL":
          // Compléter automatiquement tous les items en attente
          const pendingItems = currentRecord.getPendingItems();
          for (const action of pendingItems.actions) {
            await this.completeAction(session, { actionId: action.id });
          }
          for (const task of pendingItems.tasks) {
            await this.completeTask(session, { taskId: task.id });
          }
          break;

        default:
          return Result.fail(`Action de completion inconnue: ${action}`);
      }

      // Vérifier si le record est maintenant complet
      if (currentRecord.isCompleted()) {
        currentRecord.markAsCompleted();
        return Result.ok({
          success: true,
          operation: OrchestratorOperation.HANDLE_USER_RESPONSE,
          session,
          message: "Record terminé suite à la réponse utilisateur",
          nextOperation: OrchestratorOperation.TRANSITION_PHASE
        });
      }

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.HANDLE_USER_RESPONSE,
        session,
        message: "Réponse de completion traitée",
        nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
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

  /**
   * Marque une action comme complétée
   */
  private async completeAction(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        return Result.fail("Aucun record quotidien actif");
      }

      if (!context?.actionId) {
        return Result.fail("ID de l'action requis");
      }

      const result = currentRecord.completeAction(context.actionId);
      if (result.isFailure) {
        return Result.fail(formatError(result, PatientCareOrchestratorService.name));
      }

      // Vérifier si le record est maintenant complet
      if (currentRecord.isCompleted()) {
        currentRecord.markAsCompleted();
        return Result.ok({
          success: true,
          operation: OrchestratorOperation.COMPLETE_ACTION,
          session,
          message: "Action complétée - Record terminé",
          nextOperation: OrchestratorOperation.TRANSITION_PHASE
        });
      }

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.COMPLETE_ACTION,
        session,
        message: "Action marquée comme complétée",
        nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Marque une tâche comme complétée
   */
  private async completeTask(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        return Result.fail("Aucun record quotidien actif");
      }

      if (!context?.taskId) {
        return Result.fail("ID de la tâche requis");
      }

      const result = currentRecord.completeTask(context.taskId);
      if (result.isFailure) {
        return Result.fail(formatError(result, PatientCareOrchestratorService.name));
      }

      // Vérifier si le record est maintenant complet
      if (currentRecord.isCompleted()) {
        currentRecord.markAsCompleted();
        return Result.ok({
          success: true,
          operation: OrchestratorOperation.COMPLETE_TASK,
          session,
          message: "Tâche complétée - Record terminé",
          nextOperation: OrchestratorOperation.TRANSITION_PHASE
        });
      }

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.COMPLETE_TASK,
        session,
        message: "Tâche marquée comme complétée",
        nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Marque une action comme non complétée
   */
  private async markActionIncomplete(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        return Result.fail("Aucun record quotidien actif");
      }

      if (!context?.actionId) {
        return Result.fail("ID de l'action requis");
      }

      const result = currentRecord.markActionAsNotCompleted(context.actionId);
      if (result.isFailure) {
        return Result.fail(formatError(result, PatientCareOrchestratorService.name));
      }

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.MARK_ACTION_INCOMPLETE,
        session,
        message: "Action marquée comme non complétée",
        nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Marque une tâche comme non complétée
   */
  private async markTaskIncomplete(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        return Result.fail("Aucun record quotidien actif");
      }

      if (!context?.taskId) {
        return Result.fail("ID de la tâche requis");
      }

      const result = currentRecord.markTaskAsNotCompleted(context.taskId);
      if (result.isFailure) {
        return Result.fail(formatError(result, PatientCareOrchestratorService.name));
      }

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.MARK_TASK_INCOMPLETE,
        session,
        message: "Tâche marquée comme non complétée",
        nextOperation: OrchestratorOperation.COMPLETE_DAILY_RECORD
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Marque le record quotidien comme incomplet
   */
  private async markRecordIncomplete(
    session: PatientCareSession,
    context?: any
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        return Result.fail("Aucun record quotidien actif");
      }

      // Vérifier les règles de l'utilisateur
      const recordDate = DomainDateTime.create(currentRecord.getDate()).val;
      const today = DomainDateTime.now();

      if (recordDate.isSameDay(today)) {
        return Result.fail("Impossible de marquer un record du jour comme incomplet");
      }

      currentRecord.markAsIncompleted();

      return Result.ok({
        success: true,
        operation: OrchestratorOperation.MARK_RECORD_INCOMPLETE,
        session,
        message: "Record marqué comme incomplet",
        nextOperation: OrchestratorOperation.SYNCHRONIZE_STATE
      });
    } catch (e) {
      return handleError(e);
    }
  }

  /**
   * Vérifie et gère automatiquement la completion des records selon les règles
   * Cette méthode est appelée dans la boucle d'orchestration continue
   */
  private async checkAndHandleRecordCompletion(
    session: PatientCareSession
  ): Promise<Result<OrchestratorResult>> {
    try {
      const currentRecord = session.getCurrentDailyRecord();
      if (!currentRecord) {
        // Pas de record actif, continuer
        return Result.ok({
          success: true,
          operation: OrchestratorOperation.SYNCHRONIZE_STATE,
          session,
          message: "Aucun record actif",
          nextOperation: OrchestratorOperation.SYNCHRONIZE_STATE
        });
      }

      const recordDate = DomainDateTime.create(currentRecord.getDate()).val;
      const today = DomainDateTime.now();
      const isCompleted = currentRecord.isCompleted();
      const pendingItems = currentRecord.getPendingItems();
      const hasPendingItems = (pendingItems.actions.length + pendingItems.tasks.length) > 0;

      // RÈGLE 1: Si le record est déjà terminé, continuer
      if (isCompleted) {
        return Result.ok({
          success: true,
          operation: OrchestratorOperation.SYNCHRONIZE_STATE,
          session,
          message: "Record déjà terminé",
          nextOperation: OrchestratorOperation.SYNCHRONIZE_STATE
        });
      }

      // RÈGLE 2: Si c'est aujourd'hui et qu'il y a des items en attente
      if (recordDate.isSameDay(today) && hasPendingItems) {
        // Envoyer un message de notification REQUIérant une réponse
        const message = session.sendMessage(
          MessageType.MISSING_VARIABLES_NOTIFICATION,
          `Le record du jour (${recordDate.toString()}) a ${pendingItems.actions.length + pendingItems.tasks.length} items non terminés. Voulez-vous les compléter maintenant ou marquer comme incomplet ?`,
          true, // requiresResponse = true
          DecisionType.VARIABLE_PROVISION
        );

        return Result.ok({
          success: true,
          operation: OrchestratorOperation.SYNCHRONIZE_STATE,
          session,
          message: `Notification envoyée pour ${pendingItems.actions.length + pendingItems.tasks.length} items en attente`,
          requiresUserAction: true,
          nextOperation: OrchestratorOperation.HANDLE_USER_RESPONSE
        });
      }

      // RÈGLE 3: Si c'est un jour passé et qu'il y a des items en attente
      if (recordDate.isBefore(today) && hasPendingItems) {
        // Marquer automatiquement comme incomplet (sans réponse utilisateur)
        currentRecord.markAsIncompleted();

        // Envoyer une notification simple (sans réponse requise)
        session.sendMessage(
          MessageType.GENERAL_NOTIFICATION,
          `Le record du ${recordDate.toString()} a été automatiquement marqué comme incomplet (${pendingItems.actions.length + pendingItems.tasks.length} items non terminés)`,
          false // requiresResponse = false
        );

        return Result.ok({
          success: true,
          operation: OrchestratorOperation.SYNCHRONIZE_STATE,
          session,
          message: `Record passé marqué comme incomplet automatiquement`,
          nextOperation: OrchestratorOperation.SYNCHRONIZE_STATE
        });
      }

      // RÈGLE 4: Si c'est un jour passé et que tout est terminé
      if (recordDate.isBefore(today) && !hasPendingItems && !isCompleted) {
        // Marquer comme terminé
        currentRecord.markAsCompleted();

        return Result.ok({
          success: true,
          operation: OrchestratorOperation.SYNCHRONIZE_STATE,
          session,
          message: `Record passé marqué comme terminé`,
          nextOperation: OrchestratorOperation.SYNCHRONIZE_STATE
        });
      }

      // Cas par défaut : continuer
      return Result.ok({
        success: true,
        operation: OrchestratorOperation.SYNCHRONIZE_STATE,
        session,
        message: "Vérification de completion terminée",
        nextOperation: OrchestratorOperation.SYNCHRONIZE_STATE
      });

    } catch (e) {
      return handleError(e);
    }
  }
}
