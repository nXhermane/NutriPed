# DateCalculatorService

## Vue d'ensemble

`DateCalculatorService` est un service utilitaire sans état qui fournit des méthodes pour calculer les dates de prochaine action/tâche en fonction de la fréquence et de la durée.

## Méthodes Principales

### `calculateNextDate(frequency, duration, startDate, lastExecutionDate)`

Calcule la prochaine date d'exécution.

- **Paramètres:**
  - `frequency` (IFrequency): La fréquence de l'action/tâche.
  - `duration` (IDuration): La durée totale du traitement/monitoring.
  - `startDate` (DomainDateTime): La date de début.
  - `lastExecutionDate` (DomainDateTime | null): La dernière date d'exécution.
- **Retourne:** `Result<DomainDateTime | null>`
  - `DomainDateTime`: La prochaine date d'exécution.
  - `null`: Si le traitement/monitoring est terminé.
  - `Result.fail()`: En cas d'erreur de calcul.

### `isDueForExecution(nextDate, currentDate)`

Vérifie si une action/tâche est due à une date donnée.

- **Paramètres:**
  - `nextDate` (DomainDateTime | null): La prochaine date d'exécution prévue.
  - `currentDate` (DomainDateTime): La date actuelle.
- **Retourne:** `boolean`

## Logique de Calcul

### Calcul de l'Intervalle

L'intervalle en heures est calculé comme suit:
`intervalInHours = (intervalValue * unitInHours) / countInUnit`

- `unitInHours`:
  - `HOURS`: 1
  - `DAY`: 24
  - `WEEK`: 168

### Vérification de la Durée

Le service vérifie si la durée est écoulée en se basant sur le type de durée (`DAYS`, `HOURS`, `WHILE_IN_PHASE`).

- **`WHILE_IN_PHASE`**: Continue indéfiniment.
- **`DAYS` / `HOURS`**: Vérifie si la différence entre la date de début et la date actuelle est inférieure à la durée spécifiée.
