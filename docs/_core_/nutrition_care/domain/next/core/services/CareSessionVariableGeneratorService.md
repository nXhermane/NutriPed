# CareSessionVariableGeneratorService

## Vue d'ensemble

`CareSessionVariableGeneratorService` est un service crucial qui génère les variables de contexte nécessaires à l'évaluation et à la recommandation des plans de soins. Il collecte des informations à partir de différentes sources (dossier médical, phase de soins actuelle, etc.) pour créer un contexte riche.

## Méthodes Principales

### `generateInitialVariables(patientId, targetDate)`

Génère le contexte initial pour un patient à une date donnée. Ce contexte est utilisé pour déterminer les traitements standards lors de la création d'une nouvelle phase de soins.

- **Sources de données:**
  - Poids et taille à l'admission.
  - Informations de base du patient.

### `generateEvaluationVariables(patientId, currentCarePhase, targetDate)`

Génère le contexte complet pour l'évaluation d'une phase de soins.

- **Sources de données:**
  - **Variables dynamiques:** Jours dans la phase, etc.
  - **Variables calculées:** Gain de poids, perte de poids, etc. (via `IComputedVariablePerformerACL`).
  - **Variables du dossier médical:** Données de laboratoire, signes vitaux, etc. (via `MedicalRecordVariableTransformerAcl`).
  - **Variables des deux derniers jours:** Apport calorique, volume de lait, etc.

## ACL (Anti-Corruption Layer)

Ce service utilise deux ACL pour communiquer avec d'autres Bounded Contexts:

- **`IComputedVariablePerformerACL`**: Pour calculer des variables complexes (ex: gain de poids sur une période).
- **`MedicalRecordVariableTransformerAcl`**: Pour extraire et transformer des données du dossier médical.
