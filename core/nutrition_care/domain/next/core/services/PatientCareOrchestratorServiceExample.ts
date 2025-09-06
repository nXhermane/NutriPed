/**
 * Exemple d'utilisation du PatientCareOrchestratorService
 * Ce fichier montre comment utiliser l'orchestrateur pour gérer
 * le cycle de vie complet d'une session de soin nutritionnel
 */

import { PatientCareSession, UserResponse } from "../models";
import {
  PatientCareOrchestratorService,
  OrchestratorOperation,
  OrchestratorResult
} from "./PatientCareOrchestratorService";
import { IPatientCareOrchestratorService } from "./interfaces";

// Exemple d'utilisation complète
export class PatientCareWorkflowExample {

  constructor(private readonly orchestrator: IPatientCareOrchestratorService) {}

  /**
   * Exemple complet du workflow d'un patient
   */
  async runCompletePatientWorkflow(patientId: string): Promise<void> {
    console.log("🚀 Démarrage du workflow patient");

    // 1. Créer la session
    const sessionResult = PatientCareSession.create(
      { patientId },
      patientId, // ID de session
      // idGenerator would be injected here
    );

    if (sessionResult.isFailure) {
      console.error("❌ Échec création session");
      return;
    }

    let session = sessionResult.val;
    let currentOperation: OrchestratorOperation = OrchestratorOperation.INITIALIZE_SESSION;

    // 2. Boucle principale d'orchestration
    while (currentOperation !== OrchestratorOperation.COMPLETE_DAILY_RECORD) {
      console.log(`\n📋 Exécution opération: ${currentOperation}`);

      const result = await this.orchestrator.orchestrate(session, currentOperation, {
        patientVariables: { weight: 65, height: 170, age: 2 } // Variables patient
      });

      if (result.isFailure) {
        console.error("❌ Échec orchestration");
        break;
      }

      const orchestratorResult: OrchestratorResult = result.val;
      session = orchestratorResult.session;

      console.log(`✅ ${orchestratorResult.message}`);

      // Gérer les actions utilisateur requises
      if (orchestratorResult.requiresUserAction) {
        console.log("👤 Action utilisateur requise - simulation de réponse");

        // Simuler une réponse utilisateur
        const userResponse = await this.simulateUserResponse(orchestratorResult);
        currentOperation = OrchestratorOperation.HANDLE_USER_RESPONSE;

        // Traiter la réponse
        const responseResult = await this.orchestrator.orchestrate(session, currentOperation, {
          userResponse
        });

        if (responseResult.isSuccess) {
          session = responseResult.val.session;
          currentOperation = responseResult.val.nextOperation || OrchestratorOperation.SYNCHRONIZE_STATE;
        }
      } else {
        currentOperation = orchestratorResult.nextOperation || OrchestratorOperation.SYNCHRONIZE_STATE;
      }

      // Éviter les boucles infinies
      if (!currentOperation) break;
    }

    console.log("🏁 Workflow terminé");
  }

  /**
   * Simulation de réponse utilisateur
   */
  private async simulateUserResponse(orchestratorResult: OrchestratorResult): Promise<any> {
    // Simuler différents types de réponses selon le contexte
    const pendingMessages = orchestratorResult.session.getPendingMessages();

    if (pendingMessages.length > 0) {
      const firstMessage = pendingMessages[0];

      switch (firstMessage.type) {
        case "PHASE_TRANSITION_REQUEST":
          return {
            messageId: firstMessage.id,
            response: "oui",
            decisionData: {
              type: "PHASE_TRANSITION",
              nextPhase: "RECUPERATION"
            }
          };

        case "MISSING_VARIABLES_NOTIFICATION":
          return {
            messageId: firstMessage.id,
            response: "Variables fournies",
            decisionData: {
              type: "VARIABLE_PROVISION",
              variables: { weight: 65, height: 170 }
            }
          };

        default:
          return {
            messageId: firstMessage.id,
            response: "ok",
            decisionData: { type: "GENERAL_CONFIRMATION" }
          };
      }
    }

    return null;
  }

  /**
   * Exemple de synchronisation d'état (rejeu automatique)
   */
  async synchronizePatientState(session: PatientCareSession): Promise<void> {
    console.log("🔄 Synchronisation de l'état patient");

    const result = await this.orchestrator.orchestrate(
      session,
      OrchestratorOperation.SYNCHRONIZE_STATE,
      {
        patientVariables: { weight: 65, height: 170, age: 2 }
      }
    );

    if (result.isSuccess) {
      console.log(`✅ ${result.val.message}`);
    } else {
      console.error("❌ Échec synchronisation");
    }
  }

  /**
   * Exemple de gestion d'une réponse utilisateur
   */
  async handleUserInteraction(
    session: PatientCareSession,
    messageId: string,
    userResponse: string,
    decisionData?: any
  ): Promise<void> {
    console.log("💬 Traitement réponse utilisateur");

    const result = await this.orchestrator.orchestrate(
      session,
      OrchestratorOperation.HANDLE_USER_RESPONSE,
      {
        userResponse: {
          messageId,
          response: userResponse,
          decisionData
        }
      }
    );

    if (result.isSuccess) {
      console.log(`✅ ${result.val.message}`);
    } else {
      console.error("❌ Échec traitement réponse");
    }
  }
}

/**
 * Points clés du système d'orchestration :
 *
 * 1. **Cycle de Vie Complet** :
 *    - Initialisation → Génération → Exécution → Évaluation → Transition
 *
 * 2. **Communication Interactive** :
 *    - Messages système ↔ Réponses utilisateur
 *    - Décisions médicales guidées
 *    - Variables manquantes gérées dynamiquement
 *
 * 3. **État Cohérent** :
 *    - Validation avant chaque opération
 *    - Synchronisation automatique
 *    - Rejeu des états manqués
 *
 * 4. **Robustesse Médicale** :
 *    - Contrôle strict des transitions
 *    - Validation des données patient
 *    - Gestion des urgences et exceptions
 *
 * 5. **Observabilité** :
 *    - Logs détaillés de chaque opération
 *    - Historique des décisions
 *    - Traçabilité complète
 */
