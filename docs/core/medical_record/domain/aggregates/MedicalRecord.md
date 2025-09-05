# MedicalRecord (Aggregate Root)

**Fichier Source:** `core/medical_record/domain/models/aggregates/MedicalRecord.ts`

## 1. Vue d'Ensemble

L'entité `MedicalRecord` est la **Racine d'Agrégat** (Aggregate Root) du module `Medical Record`. Son rôle est très différent de celui des autres agrégats comme `Patient` ou `NutritionalDiagnostic`. Il n'agit pas comme un objet métier complexe, mais plutôt comme un **journal ou un conteneur pour l'historique des données cliniques** d'un patient.

Sa responsabilité principale est de maintenir une collection chronologique de tous les points de données enregistrés pour un patient au fil du temps.

## 2. Structure et Composition (`IMedicalRecord`)

La structure de l'agrégat est essentiellement une collection de tableaux. Chaque tableau contient l'historique des enregistrements pour un type de donnée spécifique.

| Propriété            | Type                       | Description                                            |
| -------------------- | -------------------------- | ------------------------------------------------------ |
| `patientId`          | `AggregateID`              | La référence à l'agrégat `Patient` concerné.           |
| `anthropometricData` | `AnthropometricRecord[]`   | Historique de toutes les mesures anthropométriques.    |
| `clinicalData`       | `ClinicalSingDataRecord[]` | Historique de tous les signes cliniques observés.      |
| `biologicalData`     | `BiologicalValueRecord[]`  | Historique de tous les résultats de tests biologiques. |
| `complicationData`   | `ComplicationDataRecord[]` | Historique de toutes les complications observées.      |
| `appetiteTests`      | `AppetiteTestRecord[]`     | Historique de tous les tests d'appétit.                |
| `dataFieldsResponse` | `DataFieldResponse[]`      | Historique des réponses aux champs de données divers.  |
| `orienationResults`  | `OrientationRecord[]`      | Historique des décisions d'orientation du patient.     |

Chaque élément de ces tableaux (ex: `AnthropometricRecord`) est une petite entité qui contient la donnée elle-même, un timestamp (`recordedAt`), et d'autres métadonnées.

## 3. Responsabilités Clés

### 3.1. Journalisation des Données

La fonction première de l'agrégat est d'ajouter de nouveaux enregistrements à ses listes via des méthodes comme `addAnthropometricData(record)`. Cela permet de construire l'historique médical du patient de manière incrémentale.

### 3.2. Publication d'Événements "Last Changed"

C'est un patron de conception central dans cet agrégat. **Chaque fois qu'un nouvel enregistrement est ajouté**, l'agrégat publie un événement de domaine pour signaler que la **dernière valeur connue** pour ce type de donnée a changé.

_Exemple :_

1.  Un utilisateur ajoute un nouveau poids via `addAnthropometricData(newWeightRecord)`.
2.  La méthode ajoute `newWeightRecord` au tableau `anthropometricData`.
3.  Elle appelle ensuite une méthode privée `publishAnthropometricDataChange(code)`.
4.  Cette méthode privée recherche dans le tableau la mesure la plus récente pour le code "poids" et publie un événement `LastAnthropometricDataChangedEvent` contenant uniquement cette dernière valeur.

Ce mécanisme permet aux autres modules de s'abonner très facilement aux données les plus à jour d'un patient sans avoir à interroger et à analyser tout l'historique du dossier médical.

### 3.3. Accès aux Données Historiques

L'agrégat expose des méthodes pour récupérer les données les plus récentes, potentiellement filtrées par une date.

- **`getLatestAnthropometricDataUntilDate(date?: DomainDateTime)`**
  Cette méthode permet à d'autres services de poser des questions complexes comme : "Quelles étaient les dernières mesures connues pour ce patient juste avant son évaluation du 5 mars ?". Elle parcourt l'historique, filtre les enregistrements antérieurs à la date donnée, puis trouve la valeur la plus récente pour chaque type de mesure.

### 3.4. Correction de l'Historique

Les méthodes `change...` (ex: `changeAnthropometricRecord`) et `delete...` (ex: `deleteAnthropometricRecord`) permettent de modifier ou de supprimer des enregistrements existants. C'est une fonctionnalité essentielle pour corriger les erreurs de saisie de données tout en maintenant l'intégrité de l'historique et en publiant les événements de mise à jour appropriés.

## 4. Création (`create` static method)

La méthode de fabrique est très simple :

```typescript
static create(createProps: { patientId: AggregateID }, id: AggregateID): Result<MedicalRecord>
```

Elle prend simplement un `patientId` et initialise un `MedicalRecord` avec des tableaux vides, prêt à être rempli au fil du temps.
