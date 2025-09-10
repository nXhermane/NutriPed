# TreatmentDateManagementService

## Vue d'ensemble

`TreatmentDateManagementService` est un service de domaine qui gère la logique de mise à jour des dates pour les traitements (`OnGoingTreatment`) et les paramètres de monitoring (`MonitoringParameter`).

## Méthodes Principales

### `updateTreatmentNextActionDate(treatment, executionDate)`

Met à jour la date de la prochaine action pour un traitement après son exécution.

- **Logique:**
  1. Appelle `updateNextActionDateAfterExecution()` sur l'entité `OnGoingTreatment`.
  2. Retourne un `Result` indiquant si le traitement est terminé.

### `updateMonitoringParameterNextTaskDate(parameter, executionDate)`

Met à jour la date de la prochaine tâche pour un paramètre de monitoring après son exécution.

- **Logique:**
  1. Appelle `updateNextTaskDateAfterExecution()` sur l'entité `MonitoringParameter`.
  2. Retourne un `Result` indiquant si le monitoring est terminé.
