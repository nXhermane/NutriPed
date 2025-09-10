# PatientCarePhaseManagerService

## Vue d'ensemble

`PatientCarePhaseManagerService` est le service orchestrateur principal pour la gestion du cycle de vie d'une `CarePhase`. Il combine la génération de variables, l'évaluation de la phase et l'application des plans de soins.

## Méthodes Principales

### `generate(carePhaseCode, patientId, targetDate)`

Génère une nouvelle `CarePhase` pour un patient.

- **Logique:**
  1. Crée une instance de `CarePhase` avec un plan de traitement vide.
  2. Génère le contexte initial via `CareSessionVariableGeneratorService`.
  3. Détermine les recommandations de soins initiales via `ICarePhaseReferenceOrchestrator`.
  4. Applique le plan de soins initial via `CarePlanApplicatorService`.
  5. Retourne la `CarePhase` nouvellement créée et configurée.

### `evaluate(carePhase, patientId, targetDate)`

Évalue l'état d'une `CarePhase` existante.

- **Logique:**
  1. Génère le contexte d'évaluation complet via `CareSessionVariableGeneratorService`.
  2. Évalue la phase via `ICarePhaseReferenceOrchestrator` pour obtenir une décision (`CONTINUE`, `TRANSITION_TO_NEXT`, `FAILURE`).
  3. **Si `CONTINUE`:**
     - Applique les recommandations de soins standards.
     - Applique les ajustements de plan de soins.
     - Retourne une décision `CONTINUE`.
  4. **Si `TRANSITION_TO_NEXT` ou `FAILURE`:**
     - Retourne une décision avec la phase cible (si applicable), laissant le soin à la couche application de gérer la transition.

## Rôle d'Orchestrateur

Ce service agit comme une façade, coordonnant plusieurs autres services pour accomplir des tâches de haut niveau. Il est le point d'entrée principal pour la gestion des phases de soins.
