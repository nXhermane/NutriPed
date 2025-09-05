# Medical Record Use Cases

**Dossier Source:** `core/medical_record/application/useCases/`

## 1. Vue d'Ensemble

Les cas d'utilisation du module `Medical Record` fournissent une API applicative pour interagir avec l'agrégat [MedicalRecord](../domain/aggregates/MedicalRecord.md). Ils permettent d'effectuer des opérations CRUD (Create, Read, Update, Delete) sur l'historique des données du patient et d'exécuter des requêtes complexes.

---

## 2. Cas d'Utilisation Principaux

- **`Create`**
  - **Objectif :** Créer un nouveau dossier médical vide pour un patient.
  - **Orchestration :**
    1.  Prend un `patientId` en entrée.
    2.  Appelle la méthode statique `MedicalRecord.create()` pour instancier un nouvel agrégat.
    3.  Sauvegarde le nouvel agrégat via le `MedicalRecordRepository`.

- **`AddData`**
  - **Objectif :** Ajouter un nouvel enregistrement de donnée (anthropométrique, clinique, etc.) au dossier d'un patient.
  - **Orchestration :**
    1.  Charge l'agrégat `MedicalRecord` du patient.
    2.  Appelle la méthode appropriée sur l'instance (ex: `medicalRecord.addAnthropometricData(...)`).
    3.  Sauvegarde l'agrégat mis à jour. L'agrégat lui-même aura déjà ajouté le `Last...ChangedEvent` approprié, qui sera publié par le repository.

- **`Update`**
  - **Objectif :** Modifier un enregistrement de donnée spécifique dans l'historique.
  - **Orchestration :**
    1.  Charge l'agrégat `MedicalRecord`.
    2.  Appelle la méthode de modification appropriée (ex: `medicalRecord.changeAnthropometricRecord(...)`) en passant l'ID de l'enregistrement à modifier et les nouvelles données.
    3.  Sauvegarde l'agrégat mis à jour.

- **`DeleteData`**
  - **Objectif :** Supprimer un enregistrement de donnée spécifique de l'historique.
  - **Orchestration :** Similaire à `Update`, mais appelle les méthodes `delete...` de l'agrégat.

- **`Get`**
  - **Objectif :** Récupérer l'intégralité du dossier médical d'un patient.
  - **Orchestration :** Appelle simplement `getById` sur le `MedicalRecordRepository` et retourne les données, probablement mappées en DTO.

- **`GetLastestValuesUntilDate`**
  - **Objectif :** C'est un cas d'utilisation de lecture complexe et puissant. Il permet de connaître l'état de santé d'un patient à un moment précis dans le passé.
  - **Orchestration :**
    1.  Charge l'agrégat `MedicalRecord` complet.
    2.  Appelle les différentes méthodes `getLatest...UntilDate(date)` sur l'instance de l'agrégat.
    3.  Rassemble les résultats et les retourne, probablement dans un DTO de réponse structuré.
  - **Importance :** Ce cas d'utilisation est probablement fondamental pour le module `Evaluation`, qui a besoin de connaître les données d'un patient à la date d'une évaluation pour effectuer ses calculs.
