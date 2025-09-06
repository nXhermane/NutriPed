import { AggregateID, DomainDateTime } from "@/core/shared";
import { PatientCareSession } from "../../models";
import { PatientCareOrchestratorService, OrchestratorOperation } from "../PatientCareOrchestratorService";

/**
 * EXEMPLE D'UTILISATION DU PATIENT CARE ORCHESTRATOR SERVICE
 *
 * Ce fichier montre comment utiliser le système d'orchestration avec
 * la nouvelle fonctionnalité de completion automatique des actions et tâches.
 */
export class PatientCareOrchestratorExample {

  constructor(
    private readonly orchestrator: PatientCareOrchestratorService
  ) {}

  /**
   * EXEMPLE 1: Orchestration automatique complète
   * Le système gère automatiquement la completion selon les règles temporelles
   */
  async exampleCompleteAutomaticOrchestration(
    session: PatientCareSession,
    patientVariables: Record<string, number>
  ) {
    console.log("🚀 Démarrage de l'orchestration automatique complète");

    const result = await this.orchestrator.orchestrateWithContinuousEvaluation(session, {
      patientVariables,
      maxIterations: 50
    });

    if (result.isFailure) {
      console.error("❌ Échec de l'orchestration");
      return;
    }

    const orchestratorResult = result.val;
    console.log("✅ Orchestration terminée:", orchestratorResult.message);

    if (orchestratorResult.requiresUserAction) {
      console.log("⏸️  Arrêt pour réponse utilisateur:", orchestratorResult.message);
      // Ici, l'application devrait présenter l'interface utilisateur
      // pour permettre à l'utilisateur de répondre au message
    }
  }

  /**
   * EXEMPLE 2: Completion manuelle d'actions individuelles
   */
  async exampleManualActionCompletion(
    session: PatientCareSession,
    actionId: AggregateID
  ) {
    console.log("🔧 Completion manuelle d'une action");

    const result = await this.orchestrator.orchestrate(
      session,
      OrchestratorOperation.COMPLETE_ACTION,
      { actionId }
    );

    if (result.isFailure) {
      console.error("❌ Échec de la completion");
      return;
    }

    const orchestratorResult = result.val;
    console.log("✅ Action complétée:", orchestratorResult.message);

    // Vérifier si le record est maintenant complet
    if (orchestratorResult.nextOperation === OrchestratorOperation.TRANSITION_PHASE) {
      console.log("🎉 Record terminé - Prêt pour la transition de phase");
    }
  }

  /**
   * EXEMPLE 3: Completion manuelle de tâches individuelles
   */
  async exampleManualTaskCompletion(
    session: PatientCareSession,
    taskId: AggregateID
  ) {
    console.log("📋 Completion manuelle d'une tâche");

    const result = await this.orchestrator.orchestrate(
      session,
      OrchestratorOperation.COMPLETE_TASK,
      { taskId }
    );

    if (result.isFailure) {
      console.error("❌ Échec de la completion");
      return;
    }

    const orchestratorResult = result.val;
    console.log("✅ Tâche complétée:", orchestratorResult.message);
  }

  /**
   * EXEMPLE 4: Gestion des réponses utilisateur pour la completion
   */
  async exampleHandleCompletionResponse(
    session: PatientCareSession,
    messageId: AggregateID,
    userResponse: string,
    decisionData: any
  ) {
    console.log("💬 Traitement de la réponse utilisateur pour completion");

    const result = await this.orchestrator.orchestrate(
      session,
      OrchestratorOperation.HANDLE_USER_RESPONSE,
      {
        userResponse: {
          messageId,
          response: userResponse,
          decisionData: {
            type: "COMPLETION_RESPONSE",
            ...decisionData
          }
          ,
          timestamp: DomainDateTime.now()
        }
      }
    );

    if (result.isFailure) {
      console.error("❌ Échec du traitement de la réponse");
      return;
    }

    const orchestratorResult = result.val;
    console.log("✅ Réponse traitée:", orchestratorResult.message);
  }

  /**
   * EXEMPLE 5: Marquage manuel d'un record comme incomplet
   */
  async exampleMarkRecordIncomplete(
    session: PatientCareSession
  ) {
    console.log("🏷️ Marquage manuel du record comme incomplet");

    const result = await this.orchestrator.orchestrate(
      session,
      OrchestratorOperation.MARK_RECORD_INCOMPLETE
    );

    if (result.isFailure) {
      console.error("❌ Échec du marquage");
      return;
    }

    const orchestratorResult = result.val;
    console.log("✅ Record marqué comme incomplet:", orchestratorResult.message);
  }

  /**
   * EXEMPLE COMPLET: Scénario réaliste d'utilisation
   */
  async exampleRealWorldScenario() {
    console.log("🏥 SCÉNARIO RÉALISTE: Session de soin patient");

    // 1. Créer une session
    const session = PatientCareSession.create({
      patientId: "patient_123" as AggregateID
    }, "session_123" as AggregateID).val;

    // 2. Initialiser avec une phase
    await this.orchestrator.orchestrate(
      session,
      OrchestratorOperation.INITIALIZE_SESSION,
      { phaseCode: "INITIAL_TREATMENT" as any }
    );

    // 3. Lancer l'orchestration automatique
    // Le système va:
    // - Générer les daily plans
    // - Vérifier automatiquement la completion
    // - Envoyer des notifications selon les règles temporelles
    // - S'arrêter si réponse utilisateur requise
    const result = await this.orchestrator.orchestrateWithContinuousEvaluation(session, {
      patientVariables: {
        weight: 65,
        age: 24,
        edema: 1
      }
    });

    if (result.val.requiresUserAction) {
      console.log("⏸️  L'utilisateur doit répondre à:", result.val.message);

      // Simulation d'une réponse utilisateur
      // Dans une vraie application, ceci viendrait de l'interface utilisateur
      await this.exampleHandleCompletionResponse(
        session,
        "message_id_from_ui",
        "Je vais compléter les items",
        {
          action: "COMPLETE_ALL"
        }
      );
    }

    console.log("✅ Scénario terminé");
  }

  /**
   * EXEMPLE AVANCÉ: Gestion des différents types de réponses completion
   */
  async exampleAdvancedCompletionResponses() {
    console.log("🔧 Gestion avancée des réponses de completion");

    const session = PatientCareSession.create({
      patientId: "patient_456" as AggregateID
    }, "session_456" as AggregateID).val;

    // Différents types de réponses possibles:

    // 1. Compléter des items spécifiques
    await this.exampleHandleCompletionResponse(
      session,
      "msg_1",
      "Compléter certains items",
      {
        action: "COMPLETE_ITEMS",
        itemIds: [
          { type: "action", id: "action_1" },
          { type: "task", id: "task_2" }
        ]
      }
    );

    // 2. Marquer comme incomplet
    await this.exampleHandleCompletionResponse(
      session,
      "msg_2",
      "Marquer comme incomplet",
      {
        action: "MARK_INCOMPLETE"
      }
    );

    // 3. Tout compléter automatiquement
    await this.exampleHandleCompletionResponse(
      session,
      "msg_3",
      "Tout compléter",
      {
        action: "COMPLETE_ALL"
      }
    );
  }
}

/**
 * EXEMPLE D'UTILISATION DANS UNE APPLICATION RÉELLE
 *
 * ```typescript
 * // Dans votre contrôleur/service d'application
 *
 * class PatientCareController {
 *   constructor(
 *     private readonly orchestrator: PatientCareOrchestratorService,
 *     private readonly sessionRepository: SessionRepository
 *   ) {}
 *
 *   async startPatientCare(patientId: string) {
 *     // Récupérer ou créer la session
 *     let session = await this.sessionRepository.findByPatientId(patientId);
 *
 *     if (!session) {
 *       session = PatientCareSession.create({ patientId }, generateId()).val;
 *     }
 *
 *     // Lancer l'orchestration automatique
 *     const result = await this.orchestrator.orchestrateWithContinuousEvaluation(session);
 *
 *     if (result.val.requiresUserAction) {
 *       // Stocker le message pour l'interface utilisateur
 *       await this.notifyUser(result.val.session.getPendingMessages());
 *       return { status: 'WAITING_FOR_USER', session: result.val.session };
 *     }
 *
 *     return { status: 'COMPLETED', session: result.val.session };
 *   }
 *
 *   async handleUserCompletionResponse(sessionId: string, messageId: string, response: any) {
 *     const session = await this.sessionRepository.findById(sessionId);
 *
 *     const result = await this.orchestrator.orchestrate(
 *       session,
 *       OrchestratorOperation.HANDLE_USER_RESPONSE,
 *       {
 *         userResponse: {
 *           messageId,
 *           response: response.userChoice,
 *           decisionData: {
 *             type: "COMPLETION_RESPONSE",
 *             ...response.decisionData
 *           }
 *         }
 *       }
 *     );
 *
 *     return result.val.session;
 *   }
 * }
 * ```
 */
