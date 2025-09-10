# CarePlanApplicatorService

## Vue d'ensemble

`CarePlanApplicatorService` est un service qui applique un plan de soins (`CarePlanRecommendation` ou `CarePlanAjustement`) à une `CarePhase`. Il traduit les recommandations en changements concrets sur les traitements et les paramètres de monitoring.

## Méthodes Principales

### `applyPlan(plan, carePhase)`

Applique un plan de soins complet, qui peut contenir des recommandations de traitements et des déclencheurs.

- **Logique:**
  1. **Traitements:** Pour chaque `RecommendedTreatment` dans le plan, crée une nouvelle entité `OnGoingTreatment` et l'ajoute à la `CarePhase` via `TreatmentManager`.
  2. **Déclencheurs:** Exécute les `triggers` du plan via `TriggerExecutor`.

### `applyAjustments(ajustements, carePhase)`

Applique des ajustements à un plan de soins existant.

- **Logique:**
  1. **Traitements:** Met à jour les traitements existants en se basant sur les `RecommendedTreatment` des ajustements.
  2. **Déclencheurs:** Exécute les `triggers` des ajustements.

## Dépendances

- **`TreatmentManager`**: Pour ajouter ou mettre à jour les traitements.
- **`MonitoringParameterManager`**: Pour gérer les paramètres de monitoring (implicitement via `TriggerExecutor`).
- **`TriggerExecutor`**: Pour exécuter les déclencheurs qui modifient l'état des traitements et du monitoring.
