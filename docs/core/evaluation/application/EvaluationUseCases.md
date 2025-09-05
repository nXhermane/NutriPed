# Evaluation Use Cases

**Dossier Source:** `core/evaluation/application/useCases/`

## 1. Vue d'Ensemble

La couche applicative du module `Evaluation` est très riche et contient de nombreux [Cas d'Utilisation](../../shared/application/UseCase.md). Ces cas d'utilisation orchestrent la logique complexe du domaine de l'évaluation pour accomplir des tâches spécifiques.

Ils sont organisés en sous-dossiers qui correspondent aux [sous-domaines de l'évaluation](../domain/EvaluationSubDomains.md) (`anthropometric`, `clinical`, etc.), avec un dossier `core` pour les cas d'utilisation qui gèrent l'agrégat principal `NutritionalDiagnostic`.

Cette page résume les cas d'utilisation les plus importants.

---

## 2. Cas d'Utilisation du Diagnostic Principal (`core/nutritionalDiagnostic/`)

Ce sont les cas d'utilisation centraux qui gèrent le cycle de vie d'une évaluation complète.

- **`Create`**
  - **Objectif :** Crée une nouvelle instance vide de l'agrégat `NutritionalDiagnostic` pour un patient donné. C'est le point de départ d'une nouvelle évaluation.

- **`UpdatePatientDiagnosticData`**
  - **Objectif :** Ajouter ou mettre à jour les données d'entrée d'une évaluation existante.
  - **Orchestration :** Ce cas d'utilisation prend des données (par exemple, de nouvelles mesures anthropométriques) et les passe à l'agrégat `NutritionalDiagnostic` via ses méthodes de modification (ex: `changeAnthropometricData`).

- **`GenerateDiagnosticResult`**
  - **Objectif :** C'est le cas d'utilisation le plus important. Il prend un `NutritionalDiagnostic` en phase de "collecte" et produit un `NutritionalAssessmentResult`.
  - **Orchestration :** Il fait très probablement appel au service de domaine `NutritionalAssessmentService`, qui contient la logique complexe pour analyser toutes les données d'entrée (anthropométriques, cliniques, biologiques) et générer un diagnostic complet.

- **`CorrectDiagnosticResult`**
  - **Objectif :** Permet à un utilisateur de corriger manuellement un diagnostic généré automatiquement.
  - **Orchestration :** Appelle la méthode `correctDiagnostic()` sur l'agrégat `NutritionalDiagnostic`.

- **`Get` / `Delete` / `AddNotes`**
  - Des cas d'utilisation standard pour récupérer, supprimer, ou ajouter des notes à une évaluation existante.

---

## 3. Cas d'Utilisation des Sous-domaines

Chaque sous-domaine a ses propres cas d'utilisation pour gérer ses données spécifiques et effectuer des calculs intermédiaires.

### `anthropometric/`
Contient les cas d'utilisation pour les calculs liés à l'anthropométrie.
- **`CalculateGrowthIndicatorValue` :** Calcule la valeur d'un indicateur de croissance spécifique (ex: Poids/Taille) et son Z-Score.
- **`NormalizeAnthropometricData` :** Valide et standardise les mesures anthropométriques brutes.

### `clinical/`
Contient les cas d'utilisation pour l'analyse des signes cliniques.
- **`MakeClinicalAnalysis` :** Analyse un ensemble de signes cliniques pour produire une interprétation (ex: "Signes de carence en vitamine A").

### `biological/`
Contient les cas d'utilisation pour l'interprétation des données de laboratoire.
- **`MakeBiologicalInterpretation` :** Compare les résultats des tests biologiques aux plages de référence pour déterminer s'ils sont normaux, bas ou élevés.

### `appetite_test/`
- **`EvaluateAppetite` :** Détermine si un test d'appétit est réussi ou échoué en fonction de la quantité de nourriture consommée.

---

## 4. Cas d'Utilisation de Gestion des Données de Référence

Les dossiers comme `GrowthReferenceChart`, `Indicator`, `BiochemicalReference`, etc., contiennent des cas d'utilisation de type **CRUD** (Create, Read, Update, Delete).

Leur objectif est de permettre à l'application (probablement via un panneau d'administration) de gérer les **données de référence** sur lesquelles les évaluations s'appuient. Par exemple, pour charger et mettre à jour les courbes de croissance de l'OMS qui sont utilisées pour calculer les Z-Scores.
