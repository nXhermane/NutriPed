# Reminder Use Cases

**Dossier Source:** `core/reminders/application/useCases/`

## 1. Vue d'Ensemble

Les cas d'utilisation du module `Reminder` fournissent une API applicative simple pour la gestion du cycle de vie complet des agrégats [Reminder](../domain/ReminderDomain.md).

Ils suivent une structure CRUD (Create, Read, Update, Delete) standard, chaque action étant encapsulée dans son propre cas d'utilisation.

---

## 2. `Create`

- **Dossier :** `Create/`
- **Objectif :** Créer un nouveau rappel.
- **Orchestration :**
  1.  Prend les détails du rappel (titre, message, trigger, actions) en entrée.
  2.  Appelle la méthode de fabrique `Reminder.create()` pour valider les données et créer l'instance de l'agrégat.
  3.  Sauvegarde le nouvel agrégat via le `ReminderRepository`.
  4.  Le repository publiera ensuite le `ReminderCreatedEvent`, qui sera intercepté par un service de notification pour planifier la notification système réelle.

---

## 3. `Get`

- **Dossier :** `Get/`
- **Objectif :** Récupérer un ou plusieurs rappels.
- **Orchestration :**
  1.  Prend un ID de rappel ou des paramètres de filtre en entrée.
  2.  Appelle les méthodes appropriées du `ReminderRepository` (`getById` ou `getAll`).
  3.  Utilise un `ApplicationMapper` pour convertir les entités `Reminder` en DTOs pour la couche de présentation.

---

## 4. `Update`

- **Dossier :** `Update/`
- **Objectif :** Modifier un rappel existant.
- **Orchestration :**
  1.  Charge l'instance de `Reminder` via le `ReminderRepository`.
  2.  Appelle les méthodes de modification sur l'instance (ex: `reminder.updateTrigger(...)`).
  3.  Sauvegarde l'agrégat mis à jour.
  4.  Le repository publiera le `ReminderUpdatedEvent`, ce qui permettra au service de notification d'annuler l'ancienne notification et d'en planifier une nouvelle.

---

## 5. `Delete`

- **Dossier :** `Delete/`
- **Objectif :** Supprimer un rappel.
- **Orchestration :**
  1.  Appelle la méthode `delete()` du `ReminderRepository`.
  2.  Le repository publiera le `ReminderDeletedEvent`, ce qui permettra au service de notification d'annuler la notification système correspondante.
