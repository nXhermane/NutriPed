# MonitoringParameterManager

## Vue d'ensemble

`MonitoringParameterManager` est un service qui orchestre la gestion des `MonitoringParameter` au sein d'une `CarePhase`. Il s'occupe de l'ajout, de la mise à jour, de l'activation/désactivation et de la génération des dates de tâches.

## Méthodes Principales

### `add(parameter, carePhase)`

Ajoute un nouveau `MonitoringParameter` à la `CarePhase`.

- **Logique:**
  1. Vérifie si le paramètre existe déjà.
  2. Génère la date de la tâche initiale (`generateInitialNextTaskDate`).
  3. Ajoute le paramètre à la liste des `monitoringParameters` de la phase.

### `update(parameter, carePhase)`

Met à jour un `MonitoringParameter` existant.

- **Logique:**
  1. Trouve le paramètre dans la `CarePhase`.
  2. Remplace l'ancien paramètre par le nouveau.

### `deactivate(parameterId, carePhase)`

Désactive un `MonitoringParameter`.

- **Logique:**
  1. Trouve le paramètre.
  2. Appelle la méthode `deactivate()` sur l'entité `MonitoringParameter`.

### `reactivate(parameterId, carePhase)`

Réactive un `MonitoringParameter`.

- **Logique:**
  1. Trouve le paramètre.
  2. Appelle la méthode `reactivate()` sur l'entité, ce qui régénère la date de la prochaine tâche.

### `updateNextTaskDateAfterExecution(parameterId, executionDate, carePhase)`

Met à jour la date de la prochaine tâche après son exécution.

- **Logique:**
  1. Trouve le paramètre.
  2. Appelle `updateNextTaskDateAfterExecution()` sur l'entité.
  3. Si le monitoring est terminé, le met à jour dans la `CarePhase`.
