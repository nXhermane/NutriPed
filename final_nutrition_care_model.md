# Modèle Conceptuel Détaillé et Final pour `nutrition_care`

Ce document est un guide d'architecture et d'implémentation pour le module `nutrition_care`. Il synthétise l'ensemble de nos discussions et intègre toutes les spécifications avancées requises.

## 1. Principes d'Architecture & Diagramme du Modèle

### 1.1. Agrégat "Anémique" ou "Riche" ? La Voie de l'Équilibre

La meilleure approche est un équilibre :

1.  **L'Agrégat (`PatientCareSession`)** est le garant de sa **cohérence interne**. Il contient la logique qui ne dépend que de son propre état (ex: `addDailyJournal`, `stopTreatment`).
2.  Les **Services de Domaine** sont utilisés pour la **logique métier complexe** qui dépend de collaborateurs externes (comme les tables de référence JSON) ou qui implique des calculs sur l'historique (ex: `PatientStateEvaluatorService`).

Cette séparation permet de garder un domaine riche et expressif tout en externalisant la complexité qui n'est pas intrinsèque à un agrégat.

### 1.2. Diagramme de Classes Final

Ce diagramme illustre l'architecture complète, incluant tous les services de domaine que nous avons identifiés.

```mermaid
classDiagram
    direction LR

    subgraph "Couche Application"
        class UseCases {
            <<Application Services>>
            +AdmitPatientUseCase
            +RecordDailyProgressUseCase
            +TransitionPatientPhaseUseCase
        }
    end

    subgraph "Couche Domaine"
        class PatientCareSession {
            <<Aggregate Root>>
            +activeTreatments: ActiveTreatment[]
            +dailyJournals: DailyCareJournal[]
            +addActiveTreatment()
            +stopTreatment(code)
        }
        class ActiveTreatment {
            <<Entity>>
            +treatmentCode: string
            +startDate: Date
            +status: 'ACTIVE' | 'COMPLETED'
        }
        class PatientStateEvaluatorService {
            <<Domain Service>>
            +generateContext(session): PatientContext
        }
        class TreatmentManagementService {
            <<Domain Service>>
            +applyTreatmentsForPhase(session, phaseRef)
            +updateActiveTreatmentsStatus(session)
        }
        class RuleEngineService {
            <<Domain Service>>
            +evaluate(condition, context): boolean
        }
    end

    subgraph "Contexte & Références"
        class PatientContext {
            <<DTO>>
            +weight: number
            +days_in_phase: number
            +weight_gain_rate_g_kg_day: number
        }
        class CarePhaseReference {
            <<Static Data>>
            +code: string
            +failureCriteria: PhaseCriterion[]
            +transitionCriteria: PhaseCriterion[]
            +monitoringPlan: MonitoringTask[]
            +recommendedTreatments: RecommendedTreatment[]
        }
    end

    ' --- Relations --- '
    UseCases ..> PatientCareSession : "Charge & Sauvegarde"
    UseCases ..> PatientStateEvaluatorService
    UseCases ..> TreatmentManagementService
    UseCases ..> RuleEngineService

    PatientStateEvaluatorService ..> PatientCareSession : "Lit l'historique"
    PatientStateEvaluatorService ..> PatientContext : "Crée"

    TreatmentManagementService ..> PatientCareSession : "Modifie"
    TreatmentManagementService ..> CarePhaseReference : "Lit"

    RuleEngineService ..> PatientContext : "Lit"
    RuleEngineService ..> CarePhaseReference : "Lit les critères"
```

## 2. Structures de Données Statiques (Le Cerveau du Protocole)

Voici les structures TypeScript complètes pour vos fichiers de référence JSON.

### 2.1. `CarePhaseReference` : Le Scénario de Prise en Charge

```typescript
export interface CarePhaseReference {
  code: string;
  name: string;
  description: string;
  failureCriteria: PhaseCriterion[];
  transitionCriteria: PhaseCriterion[];
  nextPhaseCode: string;
  recommendedTreatments: RecommendedTreatment[];
  monitoringPlan: MonitoringTask[];
}

export interface PhaseCriterion {
  description: string;
  condition: string; // ex: "days_in_phase >= 4 && appetite_test_result == 'FAILED'"
}
```

### 2.2. `RecommendedTreatment` : Le Plan de Traitement

```typescript
export interface RecommendedTreatment {
  type: 'nutritional' | 'systematic';
  code: string; // ex: 'MILK_F75', 'MED_AMOXICILLIN'
  duration: TreatmentDuration;
  triggers?: {
    onStart?: TreatmentTrigger[];
  };
}

interface TreatmentDuration {
  type: 'days' | 'hours' | 'while_in_phase';
  value?: number;
}

interface TreatmentTrigger {
  action: 'STOP_TREATMENT';
  targetCode: string;
}
```

### 2.3. `MonitoringTask` : Le Plan de Surveillance

```typescript
export interface MonitoringTask {
  code: string;
  label: string;
  uiType: 'numeric' | 'boolean' | 'text' | 'select';
  targetVariable: string;
  frequency: MonitoringFrequency;
}

interface MonitoringFrequency {
  intervalUnit: 'day' | 'week';
  intervalValue: number;
  countInUnit?: number; // Nombre de fois par intervalle (ex: 2 fois par jour)
}
```

*(Les autres structures comme `NutritionalProductReference`, `MedicineReference`, etc., suivent une logique similaire.)*

## 3. Logique Dynamique : Services et Pseudo-code

### 3.1. `PatientStateEvaluatorService` : Créer le Contexte

Ce service est la première étape de toute évaluation. Il lit l'historique pour calculer les variables dynamiques.

```pseudocode
class PatientStateEvaluatorService:
  function generateContext(session: PatientCareSession): PatientContext
    let context = createFrom(session.currentState) // Poids, taille, etc.

    // Calcul des durées
    context.days_in_program = daysBetween(session.startDate, today)
    context.days_in_phase = daysBetween(session.currentPhase.startDate, today)

    // Calcul des tendances (poids, etc.)
    let history = session.dailyJournals
    if history.length > 1:
      // ... logique pour calculer weight_gain_rate, has_lost_weight_2_visits, etc.
      // en parcourant l'historique.

    return context
```

### 3.2. `TreatmentManagementService` : Gérer le Cycle de Vie des Traitements

Ce service applique les plans et met à jour leur statut.

```pseudocode
class TreatmentManagementService:
  // Appelé lors d'un changement de phase
  function applyTreatmentsForPhase(session, phaseRef):
    for each plan in phaseRef.recommendedTreatments:
      if not session.hasActiveTreatment(plan.code):
        session.addActiveTreatment(plan) // Crée une entité ActiveTreatment
        // ... exécuter les triggers onStart

  // Appelé chaque jour
  function updateActiveTreatmentsStatus(session):
    for each treatment in session.activeTreatments:
      if treatment.status == 'ACTIVE':
        // Vérifier si la durée est écoulée
        if hasDurationExpired(treatment, session.currentPhase):
          treatment.status = 'COMPLETED'
```

### 3.3. `PhaseManagementService` : Orchestrer la Progression du Patient

Ce service utilise les autres pour prendre des décisions sur la progression du patient.

```pseudocode
class PhaseManagementService:
  function checkForPhaseTransition(session: PatientCareSession):

    // 1. Obtenir le contexte à jour
    let context = patientStateEvaluatorService.generateContext(session)

    // 2. Charger la référence pour la phase actuelle
    let phaseRef = loadCarePhaseReference(session.currentPhase.code)

    // 3. Évaluer les critères de transition
    let canTransition = true
    for each criterion in phaseRef.transitionCriteria:
      if ruleEngineService.evaluate(criterion.condition, context) is false:
        canTransition = false
        break

    if canTransition:
      // Déclencher un événement ou une action pour passer à la phase suivante
      session.transitionToPhase(phaseRef.nextPhaseCode)
      treatmentManagementService.applyTreatmentsForPhase(session, loadCarePhaseReference(phaseRef.nextPhaseCode))

  // (Logique similaire pour `checkForTreatmentFailure`)
```

### 3.4. Logique d'Affichage du Formulaire de Suivi

La logique pour générer le formulaire du jour se base sur le plan de monitoring.

```pseudocode
function getTasksForToday(session, carePhaseRef):
  let tasksForToday = []
  let daysInPhase = daysBetween(session.currentPhase.startDate, today)

  for each task in carePhaseRef.monitoringPlan:
    let freq = task.frequency
    if freq.intervalUnit == 'day' and (daysInPhase - 1) % freq.intervalValue == 0:
      tasksForToday.push(task)
    else if freq.intervalUnit == 'week' and (daysInPhase - 1) % 7 == 0:
      let currentWeek = floor((daysInPhase - 1) / 7)
      if currentWeek % freq.intervalValue == 0:
        tasksForToday.push(task)

  return tasksForToday
```

Ce document finalisé devrait vous fournir une base de travail extrêmement solide et détaillée pour votre implémentation.
