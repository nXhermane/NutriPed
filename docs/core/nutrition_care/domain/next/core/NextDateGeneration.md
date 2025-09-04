# Génération Automatique des Dates de Prochaine Action/Tâche

## Vue d'ensemble

Ce système permet de générer automatiquement les dates de prochaine action pour les `OnGoingTreatment` et les dates de prochaine tâche pour les `MonitoringParameter` basées sur leur fréquence et durée configurées.

## Composants Principaux

### 1. DateCalculatorService

Service utilitaire qui calcule les prochaines dates basées sur :

- **Frequency** : Définit à quelle fréquence l'action/tâche doit être exécutée
- **Duration** : Définit combien de temps le traitement/monitoring doit durer

### 2. NextDateUpdateService

Service pour gérer les mises à jour après exécution et identifier les éléments dus.

### 3. DailyScheduleService

Service de haut niveau pour la planification quotidienne.

## Structures de Fréquence

```typescript
interface IFrequency {
  intervalUnit: FREQUENCY_TYPE; // "day" | "hours" | "week"
  intervalValue: number; // Valeur de l'intervalle
  countInUnit: number; // Nombre de fois dans l'unité
}
```

### Exemples de Fréquence

| Configuration                                               | Description         | Intervalle calculé   |
| ----------------------------------------------------------- | ------------------- | -------------------- |
| `{intervalUnit: "day", intervalValue: 1, countInUnit: 3}`   | 3 fois par jour     | Toutes les 8 heures  |
| `{intervalUnit: "day", intervalValue: 2, countInUnit: 1}`   | Tous les 2 jours    | Toutes les 48 heures |
| `{intervalUnit: "week", intervalValue: 1, countInUnit: 2}`  | 2 fois par semaine  | Tous les 3.5 jours   |
| `{intervalUnit: "hours", intervalValue: 6, countInUnit: 1}` | Toutes les 6 heures | Toutes les 6 heures  |

## Structures de Durée

```typescript
interface IDuration {
  type: DURATION_TYPE; // "days" | "hours" | "while_in_phase"
  value?: number; // Valeur numérique (optionnelle pour while_in_phase)
}
```

### Types de Durée

- **DAYS** : Durée fixe en jours (ex: 7 jours)
- **HOURS** : Durée fixe en heures (ex: 48 heures)
- **WHILE_IN_PHASE** : Continue tant que la phase de soins est active

## Utilisation

### OnGoingTreatment

```typescript
// Création automatique de la première date
const treatment = OnGoingTreatment.create(createProps, id);
treatment.generateInitialNextActionDate(); // Appelé automatiquement dans TreatmentManager

// Mise à jour après exécution
const executionDate = DomainDateTime.now();
const shouldContinue =
  treatment.updateNextActionDateAfterExecution(executionDate);

// Régénération manuelle si nécessaire
treatment.generateNextActionDate();
```

### MonitoringParameter

```typescript
// Création automatique de la première date
const parameter = MonitoringParameter.create(createProps, id);
parameter.generateInitialNextTaskDate(); // Appelé automatiquement dans MonitoringParameterManager

// Mise à jour après exécution
const executionDate = DomainDateTime.now();
const shouldContinue =
  parameter.updateNextTaskDateAfterExecution(executionDate);

// Régénération manuelle si nécessaire
parameter.generateNextTaskDate();
```

### Service de Planification Quotidienne

```typescript
// Obtenir ce qui doit être fait aujourd'hui
const treatmentsDue = DailyScheduleService.getTreatmentsDueToday(treatments);
const monitoringDue =
  DailyScheduleService.getMonitoringParametersDueToday(parameters);

// Marquer comme exécuté
const result = DailyScheduleService.markTreatmentAsExecuted(treatment);
if (result.isSuccess && result.val.treatmentCompleted) {
  console.log("Traitement terminé");
}
```

## Logique de Génération

### Calcul de l'Intervalle

L'intervalle entre chaque exécution est calculé comme suit :

```
intervalInHours = (intervalValue * unitInHours) / countInUnit
```

Où `unitInHours` est :

- HOURSLY : 1
- DAILY : 24
- WEEKLY : 168 (24 \* 7)

### Vérification de Continuation

Le système vérifie si le traitement/monitoring doit continuer en fonction :

1. **WHILE_IN_PHASE** : Continue tant qu'il n'y a pas de date de fin
2. **DAYS** : Continue tant que `diffInDays(startDate) < duration.value`
3. **HOURS** : Continue tant que `diffInHours(startDate) < duration.value`

## Intégration avec les Services Existants

### Générateurs d'Actions Quotidiennes

Les services `IDailyActionGeneratorService` et `IDailyTaskGeneratorService` peuvent maintenant :

1. Utiliser `DailyScheduleService.getTreatmentsDueToday()` pour identifier les traitements à exécuter
2. Après génération d'une action, appeler `DailyScheduleService.markTreatmentAsExecuted()`

### Managers

- **TreatmentManager** : Génère automatiquement les dates lors de la création et réactivation
- **MonitoringParameterManager** : Génère automatiquement les dates lors de la création et réactivation

## Gestion des Cas Limites

1. **Traitement terminé** : Quand la durée est atteinte, `nextActionDate` devient `null` et le statut passe à `COMPLETED`
2. **Monitoring terminé** : Quand la durée est atteinte, `nextTaskDate` devient `null` et `endDate` est définie
3. **Réactivation** : Les dates sont régénérées automatiquement lors de la réactivation
4. **WHILE_IN_PHASE** : Continue indéfiniment jusqu'à ce qu'une `endDate` soit définie manuellement

## Gestion de la Date d'Exécution

Chaque entité stocke maintenant :

- `nextActionDate`/`nextTaskDate` : Prochaine date prévue
- `lastExecutionDate` : Dernière date d'exécution réelle

### Flux d'Exécution

1. **Identification** : `isDueForExecution()` vérifie si l'action/tâche est due
2. **Exécution** : Le service génère l'action/tâche quotidienne
3. **Enregistrement** : `recordExecution()` enregistre la date d'exécution réelle
4. **Calcul suivant** : `updateAfterExecution()` calcule la prochaine date basée sur l'exécution réelle

Cette approche permet :

- **Précision** : Calcul basé sur l'exécution réelle, pas sur la date prévue
- **Rattrapage** : Si une action est en retard, le calcul reste correct
- **Traçabilité** : Historique des exécutions disponible

## Architecture DDD

Le système respecte les principes DDD :

- **Entités** : Contiennent seulement la logique métier pure (validation, état)
- **Services de domaine** : Gèrent la logique complexe de calcul des dates
- **Helpers** : Services utilitaires sans état

## Avantages

1. **Automatisation** : Plus besoin de calculer manuellement les prochaines dates
2. **Cohérence** : Logique centralisée et uniforme
3. **Flexibilité** : Support de multiples patterns de fréquence et durée
4. **Maintenabilité** : Séparation claire des responsabilités selon DDD
5. **Performance** : Les services quotidiens peuvent rapidement identifier ce qui doit être exécuté
6. **Précision** : Calcul basé sur les dates d'exécution réelles
