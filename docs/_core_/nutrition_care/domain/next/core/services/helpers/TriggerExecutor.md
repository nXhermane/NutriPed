# TriggerExecutor

## Vue d'ensemble

`TriggerExecutor` est un service qui exécute des "triggers" (déclencheurs) définis dans les `CarePlanRecommendation`. Ces déclencheurs permettent de modifier dynamiquement les traitements et les paramètres de monitoring en fonction de conditions spécifiques.

## Méthodes Principales

### `execute(triggers, carePhase)`

Exécute une liste de déclencheurs sur une `CarePhase`.

- **Logique:**
  1. Itère sur chaque `trigger`.
  2. Pour chaque `trigger`, exécute l'action correspondante (`activate`, `deactivate`, `update`).
  3. Utilise `TreatmentManager` et `MonitoringParameterManager` pour appliquer les changements.

## Types de Déclencheurs

### `activate`

Active un traitement ou un paramètre de monitoring.

- **Action:** Appelle `reactivate()` sur le manager correspondant.

### `deactivate`

Désactive un traitement ou un paramètre de monitoring.

- **Action:** Appelle `deactivate()` sur le manager correspondant.

### `update`

Met à jour la fréquence ou la durée d'un traitement ou d'un paramètre de monitoring.

- **Action:**
  1. Trouve l'élément à mettre à jour.
  2. Crée une nouvelle instance avec les propriétés mises à jour.
  3. Appelle `update()` sur le manager correspondant.
