# Evaluation Sub-Domains

**Dossier Source:** `core/evaluation/domain/`

## 1. Vue d'Ensemble

Le domaine de l'`Evaluation` est complexe. Il est lui-même divisé en plusieurs **sous-domaines**, chacun étant responsable d'une facette spécifique de l'évaluation nutritionnelle. Ces sous-domaines fournissent les données d'entrée qui sont ensuite agrégées et traitées par l'agrégat [NutritionalDiagnostic](./aggregates/NutritionalDiagnostic.md).

Cette page donne une vue d'ensemble de chaque sous-domaine.

---

## 2. `anthropometry`

- **Dossier :** `anthropometry/`
- **Rôle :** Gère tout ce qui concerne les **mesures physiques** du corps du patient. C'est l'un des piliers les plus importants de l'évaluation nutritionnelle.
- **Concepts Clés :**
    - **`AnthropometricData` (Entity) :** Une entité qui contient un ensemble de mesures prises à un moment donné (poids, taille, périmètre brachial, etc.).
    - **Value Objects :** Des objets-valeur spécifiques comme `Weight`, `Height`, `MUAC` (Mid-Upper Arm Circumference) pour encapsuler les mesures et leurs unités.
    - **Services de Domaine :**
        - `ZScoreCalculationService`: Calcule les Z-Scores (indicateurs de croissance) à partir des données anthropométriques.
        - `GrowthIndicatorService`: Détermine quels indicateurs de croissance sont pertinents en fonction de l'âge et du sexe du patient (ex: Poids/Taille, Poids/Âge).

---

## 3. `clinical`

- **Dossier :** `clinical/`
- **Rôle :** Gère les **signes cliniques** observables par un professionnel de santé, qui peuvent indiquer une malnutrition ou des carences.
- **Concepts Clés :**
    - **`ClinicalData` (Entity) :** Une entité qui stocke la liste des signes cliniques observés (ex: œdème, pâleur, etc.).
    - **`ClinicalSign` (Value Object) :** Représente un signe clinique unique.
    - **Services de Domaine :**
        - `ClinicalAnalysisService`: Analyse les signes cliniques pour en déduire des diagnostics potentiels ou des niveaux de sévérité.

---

## 4. `biological`

- **Dossier :** `biological/`
- **Rôle :** Gère les résultats des **tests de laboratoire** (analyses de sang, etc.).
- **Concepts Clés :**
    - **`BiologicalTestResult` (Value Object) :** Représente le résultat d'un test spécifique (ex: Hémoglobine: 10 g/dL). Il contient le code du test, la valeur et l'unité.
    - **Services de Domaine :**
        - `BiologicalInterpretationService`: Interprète les résultats des tests en les comparant à des plages de référence pour déterminer s'ils sont normaux, bas ou élevés.

---

## 5. `appetite_test`

- **Dossier :** `appetite_test/`
- **Rôle :** Gère les informations relatives au **test d'appétit**, un test spécifique pour évaluer si un enfant sévèrement malnutri a retrouvé un appétit suffisant.
- **Concepts Clés :**
    - **`AppetiteTest` (Entity) :** Une entité qui stocke le résultat du test (réussi ou échoué) et la quantité de nourriture consommée.

---

## 6. `data_fields`

- **Dossier :** `data_fields/`
- **Rôle :** Un sous-domaine plus technique qui semble gérer la **définition et la validation des champs de données** eux-mêmes. Il permet de s'assurer que les données entrées dans les autres sous-domaines sont valides et complètes.
- **Concepts Clés :**
    - **`DataField` (Entity) :** Représente la définition d'un champ de données (ex: le champ "Poids" doit être un nombre positif).
    - **`DataFieldValidator` (Service) :** Un service pour valider une valeur par rapport à la définition d'un `DataField`.

---

Ensemble, ces sous-domaines fournissent un modèle riche et détaillé pour capturer toutes les informations nécessaires à une évaluation nutritionnelle complète, qui est ensuite orchestrée par l'agrégat `NutritionalDiagnostic`.
