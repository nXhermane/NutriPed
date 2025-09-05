# NutritionalDiagnostic (Aggregate Root)

**Fichier Source:** `core/evaluation/domain/core/models/aggregates/NutritionalDiagnostic.ts`

## 1. Vue d'Ensemble

L'entité `NutritionalDiagnostic` est la **Racine d'Agrégat** (Aggregate Root) du module `Evaluation`. C'est l'objet central qui représente une évaluation nutritionnelle complète pour un patient à un instant T.

Cet agrégat est un excellent exemple du patron **Composition sur Héritage**. Il n'a que peu de données propres ; son rôle principal est d'agréger et d'orchestrer des données et des entités provenant de plusieurs sous-domaines plus petits (`anthropometry`, `clinical`, `biological`) pour produire un résultat d'évaluation cohérent.

## 2. Structure et Composition (`INutritionalDiagnostic`)

La structure de l'agrégat révèle comment une évaluation est construite :

| Propriété               | Type                          | Description                                                                                                                    |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `patientId`             | `AggregateID`                 | La référence à l'agrégat `Patient` concerné par l'évaluation.                                                                  |
| `patientData`           | `PatientDiagnosticData`       | Une entité qui encapsule toutes les **données d'entrée** de l'évaluation, collectées depuis les sous-domaines.                 |
| `result`                | `NutritionalAssessmentResult` | Une entité qui contient le **résultat** de l'évaluation (diagnostics, classifications, etc.). Cette propriété est optionnelle. |
| `date`                  | `DomainDate`                  | La date à laquelle l'évaluation a été réalisée.                                                                                |
| `notes`                 | `array`                       | Des notes textuelles ajoutées par le clinicien.                                                                                |
| `atInit`                | `boolean`                     | Un drapeau qui gère l'état de l'évaluation (voir ci-dessous).                                                                  |
| `modificationHistories` | `DiagnosticModification[]`    | Un historique des corrections manuelles apportées au diagnostic.                                                               |

L'entité `PatientDiagnosticData` contient elle-même :

- Des données anthropométriques (`AnthropometricData`)
- Des résultats de tests biologiques (`BiologicalTestResult`)
- Des données de signes cliniques (`ClinicalData`)

## 3. Machine à États : Le Drapeau `atInit`

L'agrégat `NutritionalDiagnostic` fonctionne comme une machine à états simple, contrôlée par le drapeau `atInit`.

- **`atInit = true` : Phase de Collecte**
  - L'évaluation est en cours de création ou de modification. On collecte les données d'entrée.
  - Dans cet état, la propriété `result` **doit être `undefined`**. Le système n'a pas encore calculé de diagnostic.

- **`atInit = false` : Phase de Résultat**
  - L'évaluation a été traitée par un service de diagnostic.
  - Dans cet état, la propriété `result` **doit être définie**.

Cette logique est appliquée par la méthode `validate()`, qui est appelée après chaque modification de l'agrégat.

### Méthodes de transition d'état :

- `init()`: Passe l'état à `atInit = true` et efface le `result` existant.
- `saveDiagnostic(result)`: Passe l'état à `atInit = false` et stocke le `result` fourni.

## 4. Logique Métier et Invariants

- **Modification des Données d'Entrée :** Les méthodes `changeAnthropometricData`, `changeClinicalData`, etc., permettent de mettre à jour les données de l'évaluation.

  > **Note importante :** Dans le code, les appels à `this.init()` dans ces méthodes sont commentés. S'ils étaient actifs, cela signifierait que **toute modification des données d'entrée invaliderait automatiquement le diagnostic précédent**, forçant une nouvelle évaluation. C'est une règle métier très forte.

- **Correction Manuelle :** La méthode `correctDiagnostic(modification)` permet à un utilisateur de remplacer le `result` calculé par un nouveau, tout en gardant une trace de cette modification dans `modificationHistories`. C'est une fonctionnalité cruciale dans un contexte médical où le jugement du clinicien peut primer sur le calcul automatique.

## 5. Création de l'Agrégat

Il n'y a pas de méthode statique `create` sur cet agrégat. Cela indique que sa construction est complexe et déléguée à une **Factory** (`NutritionalDiagnosticFactory`). Cette factory est responsable de rassembler toutes les données nécessaires (informations du patient, données des sous-domaines) avant d'appeler le constructeur de `NutritionalDiagnostic`.
