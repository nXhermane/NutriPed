# Nutrition Care Sub-Modules

**Dossier Source:** `core/nutrition_care/domain/modules/`

## 1. Vue d'Ensemble

Le domaine du `Nutrition Care` est un Contexte Délimité (Bounded Context) riche, composé de plusieurs sous-modules plus petits. Chacun de ces sous-modules modélise un concept spécifique qui fait partie d'un plan de soins nutritionnels.

Ces modules fournissent les briques de construction qui sont assemblées et orchestrées par l'agrégat [PatientCareSession](./aggregates/PatientCareSession.md).

---

## 2. `carePhase`

- **Dossier :** `carePhase/`
- **Rôle :** Gère le concept de **Phase de Soins**. Un plan de traitement est généralement divisé en plusieurs phases successives (ex: "Phase de Stabilisation", "Phase de Transition", "Phase de Réhabilitation").
- **Concepts Clés :**
    - **`CarePhase` (Entity) :** Représente une phase de soins unique. Elle contient la liste des traitements, des surveillances et des objectifs spécifiques à cette phase.
    - **`Treatment` (Entity) :** Représente un traitement spécifique (ex: administration d'un lait thérapeutique) au sein d'une phase.
    - **`MonitoringParameter` (Entity) :** Représente un paramètre à surveiller (ex: prise de poids quotidienne) au sein d'une phase.

---

## 3. `medicines`

- **Dossier :** `medicines/`
- **Rôle :** Gère la prescription et le suivi de l'administration des **médicaments**.
- **Concepts Clés :**
    - **`MedicinePrescription` (Entity) :** Représente la prescription d'un médicament, avec sa dose, sa fréquence et sa durée.
    - **`MedicineAdministration` (Value Object) :** Représente l'enregistrement d'une administration de médicament à un moment donné.

---

## 4. `milk`

- **Dossier :** `milk/`
- **Rôle :** Gère les informations relatives aux **laits thérapeutiques** (comme le F-75 ou le F-100), qui sont au cœur du traitement de la malnutrition sévère.
- **Concepts Clés :**
    - **`TherapeuticMilk` (Entity) :** Représente un type de lait thérapeutique avec ses propriétés nutritionnelles.
    - **`MilkAdministration` (Entity) :** Représente l'administration d'un volume spécifique de lait à un patient.

---

## 5. `complications`

- **Dossier :** `complications/`
- **Rôle :** Modélise la gestion des **complications médicales** qui peuvent survenir pendant le traitement (ex: hypoglycémie, déshydratation).
- **Concepts Clés :**
    - **`Complication` (Entity) :** Représente une complication potentielle.
    - **`ComplicationManagementProtocol` (Value Object) :** Décrit le protocole à suivre si une complication est détectée.

---

## 6. `orientation`

- **Dossier :** `orientation/`
- **Rôle :** Gère le concept d'**Orientation**. C'est la décision initiale qui détermine quel type de plan de soins le patient doit recevoir, en se basant sur les résultats de l'évaluation.
- **Concepts Clés :**
    - **`OrientationResult` (Entity) :** Représente la décision d'orientation pour un patient. C'est l'un des principaux points d'entrée de l'agrégat `PatientCareSession`.

---

Ces sous-modules, bien que distincts, travaillent ensemble pour créer un modèle de domaine complet et détaillé pour la gestion des soins nutritionnels, permettant à l'application de suivre des protocoles de traitement complexes de manière structurée et cohérente.
