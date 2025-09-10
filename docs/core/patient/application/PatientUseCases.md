# Patient Use Cases

**Dossier Source:** `core/patient/application/useCases/`

## 1. Vue d'Ensemble

Ce dossier contient les [Cas d'Utilisation](../../shared/application/UseCase.md) qui définissent toutes les actions que l'on peut effectuer sur un [Patient](../domain/aggregates/Patient.md). Chaque cas d'utilisation est une classe qui implémente l'interface `UseCase` et orchestre une seule action métier.

L'organisation des fichiers suit une approche de "feature folder", où chaque cas d'utilisation a son propre dossier contenant sa logique, son DTO de requête (`Request.ts`) et son type de réponse (`Response.ts`).

---

## 2. `Create` (Créer un Patient)

**Dossier:** `Create/`

- **Objectif :** Créer une nouvelle entité `Patient` et la sauvegarder.
- **Orchestration :**
  1.  Reçoit les données brutes du nouveau patient dans un DTO de requête.
  2.  Appelle la méthode de fabrique `Patient.create()` pour valider les données et créer l'instance de l'agrégat.
  3.  Si la création réussit, appelle la méthode `save()` du `PatientRepository` pour persister le nouveau patient.
- **Requête (`Request.ts`) :** Contient un DTO avec les propriétés nécessaires à la création (nom, date de naissance, sexe, etc.).
- **Réponse (`Response.ts`) :** Un `Result<string>` qui contient soit l'ID du patient nouvellement créé en cas de succès, soit une erreur.

---

## 3. `Get` (Obtenir des Patients)

**Dossier:** `Get/`

- **Objectif :** Récupérer un ou plusieurs patients.
- **Orchestration :**
  1.  Reçoit un DTO de requête, qui peut contenir un ID pour un patient spécifique, ou des paramètres de filtre/pagination pour une liste.
  2.  Appelle la méthode appropriée du `PatientRepository` (par exemple, `getById()` ou `getAll()`).
  3.  Utilise un `ApplicationMapper` pour convertir les entités `Patient` du domaine en DTOs de réponse propres, destinés à l'interface utilisateur.
- **Requête (`Request.ts`) :** Contient typiquement l'ID du patient à récupérer.
- **Réponse (`Response.ts`) :** Un `Result<PatientResponseDTO | PatientResponseDTO[]>` qui contient le ou les DTOs du/des patient(s) en cas de succès, ou une erreur (par exemple, si le patient n'est pas trouvé).

---

## 4. `Update` (Mettre à jour un Patient)

**Dossier:** `Update/`

- **Objectif :** Modifier les informations d'un patient existant.
- **Orchestration :**
  1.  Reçoit un DTO de requête avec l'ID du patient à modifier et les nouvelles données.
  2.  Appelle `getById()` sur le `PatientRepository` pour charger l'entité `Patient` en mémoire.
  3.  Appelle les méthodes de modification sur l'instance de `Patient` (par exemple, `patient.changeContact(...)`). Ces méthodes contiennent la logique de validation et publient les événements de domaine.
  4.  Appelle `save()` sur le `PatientRepository` pour persister l'entité modifiée.
- **Requête (`Request.ts`) :** Contient l'ID du patient et un DTO avec les champs à mettre à jour.
- **Réponse (`Response.ts`) :** Un `Result<void>` qui indique simplement si l'opération a réussi ou échoué.

---

## 5. `Delete` (Supprimer un Patient)

**Dossier:** `Delete/`

- **Objectif :** Supprimer un patient du système.
- **Orchestration :**
  1.  Reçoit l'ID du patient à supprimer dans un DTO de requête.
  2.  Appelle la méthode `delete()` du `PatientRepository`. (Note : la logique interne du repository peut soit effectuer une suppression physique, soit une suppression logique en marquant l'entité comme supprimée).
- **Requête (`Request.ts`) :** Contient l'ID du patient à supprimer.
- **Réponse (`Response.ts`) :** Un `Result<void>` qui indique si l'opération a réussi ou échoué.
