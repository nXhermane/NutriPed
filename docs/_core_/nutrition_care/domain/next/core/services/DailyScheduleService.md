# DailyScheduleService

## Vue d'ensemble

`DailyScheduleService` est responsable de la planification quotidienne. Il identifie les traitements et les paramètres de monitoring qui sont dus pour un jour donné et gère leur exécution.

## Méthodes Principales

### `getTreatmentsDueOn(treatments, date)`

Retourne les traitements qui sont dus à une date spécifique.

- **Logique:**
  1. Itère sur les `OnGoingTreatment`.
  2. Utilise `isDueForExecution()` pour vérifier si le traitement est dû.

### `getMonitoringParametersDueOn(parameters, date)`

Retourne les paramètres de monitoring qui sont dus à une date spécifique.

- **Logique:**
  1. Itère sur les `MonitoringParameter`.
  2. Utilise `isDueForExecution()` pour vérifier si le paramètre est dû.

### `markTreatmentAsExecuted(treatment, executionDate)`

Marque un traitement comme exécuté et met à jour sa prochaine date d'action.

- **Logique:**
  1. Utilise `TreatmentDateManagementService` pour mettre à jour la date.
  2. Retourne un `Result` avec un booléen `treatmentCompleted`.

### `markMonitoringParameterAsExecuted(parameter, executionDate)`

Marque un paramètre de monitoring comme exécuté et met à jour sa prochaine date de tâche.

- **Logique:**
  1. Utilise `TreatmentDateManagementService` pour mettre à jour la date.
  2. Retourne un `Result` avec un booléen `monitoringCompleted`.
