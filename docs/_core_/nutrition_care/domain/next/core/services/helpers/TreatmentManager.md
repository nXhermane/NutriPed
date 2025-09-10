# TreatmentManager

## Vue d'ensemble

`TreatmentManager` est un service de domaine responsable de la gestion des `OnGoingTreatment` au sein d'une `CarePhase`. Il gère l'ajout, la mise à jour, la désactivation et la réactivation des traitements.

## Méthodes Principales

### `add(treatment, carePhase)`

Ajoute un nouveau traitement à la phase de soins.

- **Logique:**
  1. Vérifie si un traitement du même type est déjà actif.
  2. Si un traitement similaire est trouvé, il est désactivé avant d'ajouter le nouveau.
  3. Génère la date de la première action (`generateInitialNextActionDate`).
  4. Ajoute le traitement à la `CarePhase`.

### `update(treatment, carePhase)`

Met à jour un traitement existant.

- **Logique:**
  1. Trouve l'index du traitement à mettre à jour.
  2. Remplace l'ancien traitement par le nouveau.

### `deactivate(treatmentId, carePhase)`

Désactive un traitement en cours.

- **Logique:**
  1. Trouve le traitement par son ID.
  2. Appelle la méthode `deactivate()` sur l'entité `OnGoingTreatment`.

### `reactivate(treatmentId, carePhase)`

Réactive un traitement précédemment désactivé.

- **Logique:**
  1. Trouve le traitement par son ID.
  2. Appelle la méthode `reactivate()` sur l'entité, ce qui régénère la date de la prochaine action.

### `updateNextActionDateAfterExecution(treatmentId, executionDate, carePhase)`

Met à jour la date de la prochaine action après une exécution.

- **Logique:**
  1. Trouve le traitement.
  2. Appelle `updateNextActionDateAfterExecution()` sur l'entité.
  3. Si le traitement est terminé (la durée est écoulée), son statut est mis à jour.
