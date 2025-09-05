# Reminder Domain

**Dossier Source:** `core/reminders/domain/`

## 1. Vue d'Ensemble

Le domaine `Reminder` est responsable de la gestion des rappels et des notifications planifiées au sein de l'application. Son rôle est de permettre à l'utilisateur de créer des rappels pour des tâches futures, et de s'assurer que ces rappels sont déclenchés au bon moment.

C'est un domaine relativement simple, centré sur un unique agrégat : `Reminder`.

---

## 2. L'Agrégat `Reminder`

L'entité `Reminder` est la **Racine d'Agrégat** de ce module. Elle représente un rappel unique.

### 2.1. Composition

Un `Reminder` est composé des éléments suivants :

- **`title` et `message` (string)** : Le contenu textuel du rappel qui sera affiché à l'utilisateur.
- **`trigger` (ReminderTrigger)** : Un [ValueObject](../../shared/domain/common/ValueObject.md) qui encapsule la logique de déclenchement. Il définit **quand** le rappel doit être activé (par exemple, à une date et une heure précises, ou selon un intervalle récurrent).
- **`actions` (ReminderAction[])** : Une liste de `ValueObject`s `ReminderAction`. Chaque action définit **ce qui doit se passer** lorsque l'utilisateur interagit avec la notification du rappel (par exemple, naviguer vers une page spécifique de l'application, comme le dossier d'un patient).
- **`isActive` (boolean)** : Un drapeau pour activer ou désactiver le rappel. Un rappel inactif ne sera pas déclenché.

### 2.2. Cycle de Vie et Logique

- **Création :** Un rappel est créé via une méthode de fabrique statique `Reminder.create()`, qui prend les propriétés brutes et les valide avant de construire l'objet.
- **Activation/Désactivation :** Les méthodes `activate()` et `deactivate()` permettent de contrôler si le rappel est actif.
- **Modification :** Des méthodes comme `updateTitle()`, `updateTrigger()`, etc., permettent de modifier un rappel existant.
- **Déclenchement :** La méthode `markAsTriggered()` est appelée lorsque le rappel a été déclenché, ce qui le désactive pour éviter qu'il ne soit déclenché à nouveau (pour les rappels non récurrents).

## 3. Événements de Domaine

Le `Reminder` publie des événements de domaine à chaque étape clé de son cycle de vie. Ces événements sont cruciaux car ils sont très probablement écoutés par un service de la couche `adapter` qui interagit avec le système de notification natif de l'appareil.

- **`ReminderCreatedEvent`**
  - **Déclenché :** Lors de la création d'un rappel.
  - **Objectif :** Signaler à un service de notification qu'il doit **planifier une nouvelle notification système** en se basant sur le `trigger` et le `message` du rappel.

- **`ReminderUpdatedEvent`**
  - **Déclenché :** Lorsqu'un rappel est modifié (par exemple, si son `trigger` change).
  - **Objectif :** Signaler au service de notification qu'il doit **annuler l'ancienne notification et en planifier une nouvelle** avec les informations mises à jour.

- **`ReminderDeletedEvent`**
  - **Déclenché :** Lorsqu'un rappel est supprimé.
  - **Objectif :** Signaler au service de notification qu'il doit **annuler la notification système** qui avait été planifiée.
