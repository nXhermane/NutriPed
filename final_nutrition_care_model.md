# Modèle Final et Détaillé pour le Moteur de Protocole `nutrition_care`

Ce document est le guide d'architecture final pour votre application. Il intègre toutes vos remarques et propose un modèle résilient et dynamique pour gérer la complexité du protocole de malnutrition.

## 1. Principes d'Architecture : L'Équilibre du Domaine

Notre architecture repose sur un principe d'équilibre :
*   **L'Agrégat `PatientCareSession`** est riche : il gère son état interne et celui de ses entités (les traitements actifs, les journaux). Il sait comment démarrer ou arrêter un traitement.
*   Les **Services de Domaine** sont les chefs d'orchestre : ils contiennent la logique complexe qui utilise les données de référence (les fichiers JSON) pour prendre des décisions et commander l'agrégat.

## 2. Les Structures de Données Statiques (Le Cerveau du Protocole)

Voici les interfaces TypeScript finales pour vos fichiers JSON de référence.

### 2.1. `CarePhaseReference` : Le Scénario Complet de la Phase

```typescript
export interface CarePhaseReference {
  /** Condition pour déterminer si cette définition de phase s'applique au patient. */
  applicabilityCondition: ICondition;
  code: CARE_PHASE_CODES;
  name: string;
  failureCriteria: PhaseCriterion[];
  transitionCriteria: PhaseCriterion[];
  recommendedTreatments: RecommendedTreatment[];
  monitoringPlan: MonitoringTask[];
  followUpPlan: FollowUpAction[];
  nextPhase?: CARE_PHASE_CODES;
}

export interface PhaseCriterion {
  description: string;
  condition: ICondition;
}

export interface FollowUpAction {
  description: string;
  condition: ICondition;
  treatmentToApply: RecommendedTreatment;
}
```

### 2.2. `RecommendedTreatment` : Le Plan de Traitement Détaillé

```typescript
export interface RecommendedTreatment {
  planItemId: string; // ID unique. Ex: "PHASE1_AMOX_INITIAL"
  type: 'nutritional' | 'systematic';
  code: string; // Code du produit. Ex: "AMOX", "F75"
  duration: TreatmentDuration;
  triggers?: { onStart?: TreatmentTrigger[] };
  adjustmentPercentage?: number; // Ex: 50 pour 50% de la dose standard
}

interface TreatmentDuration {
  type: 'days' | 'while_in_phase';
  value?: number;
}

interface TreatmentTrigger {
  action: 'STOP_TREATMENT';
  targetPlanItemId: string; // Cible un plan de traitement à arrêter
}
```

### 2.3. `MedicineReference` : La Posologie Conditionnelle

```typescript
export interface MedicineReference {
  code: string; // ex: "AMOX"
  name: string;
  dosageCases: DosageCase[];
}

interface DosageCase {
  condition: ICondition; // ex: "age_in_months >= 24"
  recommendedLabel: string; // Message pour l'UI
  weightRanges: DosageByWeight[];
}
```

### 2.4. `NutritionalProduct` : Les Dosages Contextuels

```typescript
export interface NutritionalProduct {
  code: string; // ex: "F100"
  name: string;
  dosageScenarios: DosageScenario[];
}

interface DosageScenario {
  condition: ICondition;
  description: string;
  dosages: DosageByWeight[];
}

interface DosageByWeight {
  weight_kg: [number, number];
  dosePerMeal: Partial<Record<string, number>>;
}
```

### 2.5. `MonitoringTask` : Le Plan de Surveillance Flexible

```typescript
export interface MonitoringTask {
  code: string;
  label: string;
  uiType: 'numeric' | 'boolean' | 'text' | 'select';
  targetVariable: string;
  frequency: MonitoringFrequency;
}

interface MonitoringFrequency {
  intervalUnit: 'day' | 'week' | 'hour';
  intervalValue: number;
  countInUnit?: number;
}
```

## 3. L'État Dynamique : Suivi dans l'Agrégat

L'agrégat `PatientCareSession` doit suivre les traitements en cours.

```typescript
// Dans PatientCareSession.ts
class PatientCareSession {
  // ...
  activeTreatments: ActiveTreatment[];
  // ...
}

// Nouvelle Entité
interface ActiveTreatment {
  planItemId: string; // L'ID unique du plan de traitement
  treatmentCode: string; // Le code du produit
  startDate: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'STOPPED';
}
```

## 4. Exemple Concret de `CarePhaseReference` pour la Phase 1 (Standard)

```json
{
  "applicabilityCondition": { "value": "age_in_months >= 6 && weight >= 3" },
  "code": "cnt_phase_aiguë",
  "name": "Phase 1 - Cas Standard (>6 mois)",
  "failureCriteria": [
    {
      "description": "Absence de retour de l'appétit au 4ème jour.",
      "condition": { "value": "days_in_phase >= 4 && appetite_test_result == 'NEGATIVE'" }
    }
  ],
  "transitionCriteria": [
    {
      "description": "Retour de l'appétit, stabilité clinique et début de fonte des œdèmes.",
      "condition": { "value": "appetite_test_result == 'POSITIVE' && complications_number == 0 && edema <= 1" }
    }
  ],
  "nextPhase": "cnt_phase_transition",
  "recommendedTreatments": [
    {
      "planItemId": "PHASE1_F75",
      "type": "nutritional",
      "code": "F75",
      "duration": { "type": "while_in_phase" }
    },
    {
      "planItemId": "PHASE1_AMOX_INITIAL",
      "type": "systematic",
      "code": "AMOX",
      "duration": { "type": "days", "value": 7 }
    }
  ],
  "monitoringPlan": [
    {
      "code": "MONITOR_WEIGHT",
      "label": "Poids du jour (kg)",
      "uiType": "numeric",
      "targetVariable": "weight",
      "frequency": { "intervalUnit": "day", "intervalValue": 1 }
    }
  ],
  "followUpPlan": [
    {
      "description": "Si la diarrhée persiste après 2 jours, ajouter du Zinc.",
      "condition": { "value": "has_diarrhea == true && days_in_phase > 2" },
      "treatmentToApply": {
        "planItemId": "FOLLOWUP_ZINC_DIARRHEA",
        "type": "systematic",
        "code": "ZINC",
        "duration": { "type": "days", "value": 10 }
      }
    }
  ]
}
```

## 5. Logique des Services de Domaine (Pseudo-code)

Le `PhaseManagementService` devient le chef d'orchestre principal.

```pseudocode
// Appelé chaque jour pour un patient
function manageDailyFollowUp(session: PatientCareSession):

  // 1. Générer le contexte à jour (avec variables dynamiques)
  let context = patientStateEvaluatorService.generateContext(session)

  // 2. Charger la bonne définition de phase pour ce patient
  let phaseRef = loadCarePhaseReferenceForPatient(context, session.currentPhase.code)

  // 3. Exécuter le plan de suivi (actions réactives)
  for each action in phaseRef.followUpPlan:
    if ruleEngineService.evaluate(action.condition, context) is true:
      treatmentManagementService.applyTreatment(session, action.treatmentToApply)

  // 4. Mettre à jour le statut des traitements actifs
  treatmentManagementService.updateActiveTreatmentsStatus(session)

  // 5. Vérifier si une transition de phase est possible
  if ruleEngineService.evaluate(phaseRef.transitionCriteria, context) is true:
    // ... déclencher la transition vers phaseRef.nextPhase

  // 6. Sauvegarder la session mise à jour
  repo.save(session)
```

Ce modèle final est conçu pour être la colonne vertébrale d'un système expert, séparant la "connaissance" (les fichiers JSON) de la "logique" (les services).
