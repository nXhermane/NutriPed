# Nutrition Care Use Cases

**Dossier Source:** `core/nutrition_care/application/useCases/`

## 1. Vue d'Ensemble

Les cas d'utilisation du module `Nutrition Care` sont responsables de l'orchestration de tout le processus de traitement d'un patient. Ils prennent les décisions d'orientation, créent des sessions de soins, et gèrent les interactions quotidiennes avec le journal de soins du patient.

---

## 2. Cas d'Utilisation du `PatientCareSession` (`core/PatientCareSession/`)

Ces cas d'utilisation gèrent le cycle de vie de l'agrégat principal [PatientCareSession](../domain/aggregates/PatientCareSession.md).

- **`Create`**
  - **Objectif :** Créer une nouvelle session de soins pour un patient. C'est le point de départ d'un traitement.
  - **Orchestration :** Fait probablement appel à la `PatientCareSessionFactory` pour assembler un nouvel agrégat `PatientCareSession` et le sauvegarde.

- **`OrientPatient`**
  - **Objectif :** C'est un cas d'utilisation métier crucial. Il prend les résultats d'une évaluation (`NutritionalDiagnostic`) et détermine le plan de soins initial (l'orientation, les phases de soins, etc.) pour le patient.
  - **Orchestration :** Appelle très probablement le service de domaine `OrientPatientService` pour prendre la décision, puis initialise la `PatientCareSession` avec ce plan.

- **`AddData`**
  - **Objectif :** Le principal cas d'utilisation pour les interactions quotidiennes. Il permet d'ajouter n'importe quel type de donnée (une mesure, un traitement, un signe clinique) au journal du jour.
  - **Orchestration :** Charge la `PatientCareSession` du patient, et appelle la méthode `add...ToJournal` appropriée sur l'instance.

- **`GetDailyJournal`**
  - **Objectif :** Récupérer le contenu du journal de soins pour une journée spécifique.

- **`MakeCareSessionReady`**
  - **Objectif :** Probablement pour faire passer le statut de la session de `NOT_READY` à `IN_PROGRESS` une fois que toutes les informations initiales ont été configurées.

---

## 3. Cas d'Utilisation des Sous-modules

Ces cas d'utilisation fournissent une logique plus spécifique liée aux différents aspects du plan de soins.

### `medicines/`

- **`GetMedicineDosage`**
  - **Objectif :** Calculer le dosage correct d'un médicament en fonction des caractéristiques du patient (poids, âge).

### `milk/`

- **`SuggestMilk`**
  - **Objectif :** Suggérer le type de lait thérapeutique (ex: F-75, F-100) et le volume à administrer, en se basant sur la phase de soins actuelle et l'état du patient.

### `appetiteTest/`

- **`EvaluateAppetite`**
  - **Objectif :** Analyser les résultats d'un test d'appétit pour déterminer si le patient peut passer à la phase de soins suivante.

### `orientations/`

- **`Orient`**
  - **Objectif :** Similaire à `OrientPatient`, mais peut-être utilisé pour ré-orienter un patient en cours de traitement si son état change.

---

Ces cas d'utilisation montrent comment l'application traduit les besoins des utilisateurs (ex: "Suggérer le lait pour ce patient") en une série d'interactions orchestrées avec les objets riches du modèle de domaine.
