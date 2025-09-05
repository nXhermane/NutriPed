# DailyTaskGeneratorService

## Vue d'ensemble

`DailyTaskGeneratorService` génère les tâches de monitoring quotidiennes (`DailyMonitoringTask`) pour un patient, en se basant sur les paramètres de monitoring actifs.

## Méthodes Principales

### `generate(patientId, effectiveDate, monitoringParameters)`

Génère les tâches de monitoring pour une date donnée.

- **Logique:**
  1. Filtre les `MonitoringParameter` pour ne garder que ceux qui sont actifs.
  2. Pour chaque paramètre, crée une `DailyMonitoringTask`.
  3. Retourne une liste de `DailyMonitoringTask`.

## Intégration

Similaire à `DailyActionGeneratorService`, ce service est utilisé par un processus qui gère la journée de soins pour créer les tâches de monitoring nécessaires.
