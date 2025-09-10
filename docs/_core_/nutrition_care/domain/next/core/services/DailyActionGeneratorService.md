# DailyActionGeneratorService

## Vue d'ensemble

`DailyActionGeneratorService` est un service de domaine qui génère les actions de soins quotidiennes (`DailyCareAction`) pour un patient, basées sur les traitements en cours.

## Méthodes Principales

### `generate(patientId, effectiveDate, onGoingTreatments)`

Génère les actions de soins pour une date donnée.

- **Logique:**
  1. Filtre les traitements pour ne garder que ceux qui sont actifs.
  2. Pour chaque traitement, crée une `DailyCareAction`.
  3. Différencie les actions nutritionnelles et médicamenteuses.
  4. Retourne une liste de `DailyCareAction`.

## Intégration

Ce service est généralement appelé par un processus de plus haut niveau qui orchestre la journée de soins, comme un `PatientCareSession`.
