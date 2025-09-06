/**
 * Exemple d'utilisation du Port Primaire d'Orchestration des Soins Patients
 *
 * Ce fichier montre comment utiliser le port primaire depuis les use cases
 * pour interagir avec le domaine d'orchestration des soins.
 */

import { AggregateID } from "@/core/shared";
import { CARE_PHASE_CODES } from "@/core/constants";
import { PatientCareSession } from "../models";
import { IPatientCareOrchestrationPort } from "../ports/primary/IPatientCareOrchestrationPort";

/**
 * Exemple de Use Case : Initialisation d'une session de soin
 */
export class InitializePatientCareUseCase {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  async execute(patientId: AggregateID, phaseCode?: string) {
    console.log(`🚀 Initialisation session pour patient ${patientId}`);

    // Utilisation du port primaire
    const result = await this.orchestrationPort.initializePatientCareSession(
      patientId,
      phaseCode as CARE_PHASE_CODES,
      { weight: 65, height: 170, age: 2 } // Variables patient
    );

    if (result.isFailure) {
      console.error("❌ Échec initialisation");
      throw new Error("Échec initialisation session");
    }

    console.log("✅ Session initialisée avec succès");
    return result.val;
  }
}

/**
 * Exemple de Use Case : Orchestration automatique du workflow
 */
export class OrchestratePatientCareWorkflowUseCase {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  async execute(session: PatientCareSession) {
    console.log(`🔄 Orchestration automatique pour session ${session.getID()}`);

    // Orchestration continue avec évaluation
    const result = await this.orchestrationPort.orchestratePatientCareWorkflow(
      session,
      { weight: 65, height: 170 }, // Variables mises à jour
      50 // Limite d'itérations
    );

    if (result.isFailure) {
      console.error("❌ Échec orchestration");
      throw new Error("Échec orchestration workflow");
    }

    console.log("✅ Orchestration terminée");
    return result.val;
  }
}

/**
 * Exemple de Use Case : Gestion des réponses utilisateur
 */
export class HandleUserResponseUseCase {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  async execute(
    session: PatientCareSession,
    messageId: AggregateID,
    response: string
  ) {
    console.log(`💬 Traitement réponse utilisateur pour message ${messageId}`);

    const result = await this.orchestrationPort.handleUserResponse(
      session,
      messageId,
      response,
      { type: "PHASE_TRANSITION_CONFIRMATION" }
    );

    if (result.isFailure) {
      console.error("❌ Échec traitement réponse");
      throw new Error("Échec traitement réponse utilisateur");
    }

    console.log("✅ Réponse traitée avec succès");
    return result.val;
  }
}

/**
 * Exemple de Use Case : Synchronisation d'état
 */
export class SynchronizePatientStateUseCase {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  async execute(session: PatientCareSession) {
    console.log(`🔄 Synchronisation état pour session ${session.getID()}`);

    const result = await this.orchestrationPort.synchronizePatientCareState(
      session,
      { weight: 68, height: 170 } // Variables mises à jour
    );

    if (result.isFailure) {
      console.error("❌ Échec synchronisation");
      throw new Error("Échec synchronisation état");
    }

    console.log("✅ État synchronisé avec succès");
    return result.val;
  }
}

/**
 * Exemple de Use Case : Consultation des messages en attente
 */
export class GetPendingMessagesUseCase {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  async execute(session: PatientCareSession) {
    console.log(`📨 Récupération messages en attente`);

    const result = await this.orchestrationPort.getPendingMessages(session);

    if (result.isFailure) {
      console.error("❌ Échec récupération messages");
      throw new Error("Échec récupération messages");
    }

    const messages = result.val;
    console.log(`📨 ${messages.length} message(s) en attente`);

    return messages;
  }
}

/**
 * Exemple de Use Case : Consultation du statut de session
 */
export class GetPatientCareStatusUseCase {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  async execute(session: PatientCareSession) {
    console.log(`📊 Consultation statut session ${session.getID()}`);

    const result = await this.orchestrationPort.getPatientCareSessionStatus(session);

    if (result.isFailure) {
      console.error("❌ Échec récupération statut");
      throw new Error("Échec récupération statut");
    }

    const status = result.val;
    console.log(`📊 Statut: ${status.status}, Phase: ${status.currentPhase || 'Aucune'}`);

    return status;
  }
}

/**
 * Exemple complet d'utilisation du port primaire
 */
export class PatientCareWorkflowOrchestrator {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  /**
   * Workflow complet de gestion d'un patient
   */
  async orchestrateCompletePatientWorkflow(patientId: AggregateID) {
    try {
      console.log("🏥 Démarrage workflow complet pour patient", patientId);

      // 1. Initialisation
      const initUseCase = new InitializePatientCareUseCase(this.orchestrationPort);
      const session = await initUseCase.execute(patientId, "INITIAL_ASSESSMENT");

      // 2. Orchestration automatique
      const workflowUseCase = new OrchestratePatientCareWorkflowUseCase(this.orchestrationPort);
      const workflowResult = await workflowUseCase.execute(session);

      // 3. Vérification des messages en attente
      const messagesUseCase = new GetPendingMessagesUseCase(this.orchestrationPort);
      const pendingMessages = await messagesUseCase.execute(session);

      // 4. Traitement des réponses si nécessaire
      if (pendingMessages.length > 0) {
        console.log("👤 Réponses utilisateur requises");

        // Simulation de traitement des réponses
        for (const message of pendingMessages) {
          const responseUseCase = new HandleUserResponseUseCase(this.orchestrationPort);
          await responseUseCase.execute(session, message.id, "oui");
        }

        // Re-orchestration après réponses
        await workflowUseCase.execute(session);
      }

      // 5. Consultation finale du statut
      const statusUseCase = new GetPatientCareStatusUseCase(this.orchestrationPort);
      const finalStatus = await statusUseCase.execute(session);

      console.log("🏥 Workflow terminé avec succès");
      return {
        session,
        finalStatus,
        workflowResult
      };

    } catch (error) {
      console.error("❌ Erreur dans le workflow:", error);
      throw error;
    }
  }
}

/**
 * Factory pour créer les use cases avec injection de dépendances
 */
export class PatientCareUseCaseFactory {

  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}

  createInitializeUseCase(): InitializePatientCareUseCase {
    return new InitializePatientCareUseCase(this.orchestrationPort);
  }

  createWorkflowUseCase(): OrchestratePatientCareWorkflowUseCase {
    return new OrchestratePatientCareWorkflowUseCase(this.orchestrationPort);
  }

  createResponseUseCase(): HandleUserResponseUseCase {
    return new HandleUserResponseUseCase(this.orchestrationPort);
  }

  createSyncUseCase(): SynchronizePatientStateUseCase {
    return new SynchronizePatientStateUseCase(this.orchestrationPort);
  }

  createMessagesUseCase(): GetPendingMessagesUseCase {
    return new GetPendingMessagesUseCase(this.orchestrationPort);
  }

  createStatusUseCase(): GetPatientCareStatusUseCase {
    return new GetPatientCareStatusUseCase(this.orchestrationPort);
  }

  createWorkflowOrchestrator(): PatientCareWorkflowOrchestrator {
    return new PatientCareWorkflowOrchestrator(this.orchestrationPort);
  }
}
