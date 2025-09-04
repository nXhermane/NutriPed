# PatientCareSession (Aggregate Root)

**Fichier Source:** `core/nutrition_care/domain/core/models/aggregates/PatientCareSession.ts`

## 1. Vue d'Ensemble

L'entité `PatientCareSession` est la **Racine d'Agrégat** (Aggregate Root) du module `Nutrition Care`. Elle représente une **session de soins nutritionnels** complète pour un patient, c'est-à-dire une période de traitement continue qui peut s'étendre sur plusieurs jours ou semaines.

Cet agrégat est le chef d'orchestre du suivi d'un patient. Il ne se contente pas de définir un plan, il suit son exécution au jour le jour et maintient un état "vivant" du patient tout au long de la session.

## 2. Structure et Composition (`IPatientCareSession`)

La structure de l'agrégat est une composition de plusieurs entités et objets-valeur qui, ensemble, décrivent l'intégralité de la session de soins.

| Propriété | Type | Description |
| --- | --- | --- |
| `patientId` | `AggregateID` | La référence à l'agrégat `Patient` concerné. |
| `orientation` | `OrientationResult` | Le diagnostic ou la décision d'orientation qui a initié cette session de soins. |
| `carePhases` | `CarePhase[]` | La liste des **phases de soins** prévues (ex: "Phase de Stabilisation", "Phase de Réhabilitation"). |
| `currentPhase` | `CarePhase` | La phase de soins dans laquelle le patient se trouve actuellement. |
| `currentState` | `PatientCurrentState` | Une entité qui maintient un **instantané des dernières données connues** du patient (poids, signes cliniques, etc.), mis à jour en temps réel. |
| `dailyJournals`| `DailyCareJournal[]` | L'historique des journaux quotidiens. |
| `currentDailyJournal`| `DailyCareJournal`| Le journal pour la **journée en cours**, où toutes les nouvelles données sont enregistrées. |
| `status` | `PatientCareSessionStatus`| Le statut global de la session (`NOT_READY`, `IN_PROGRESS`, `COMPLETED`). |

## 3. Le Patron de Conception du "Journal Quotidien"

Le fonctionnement de cet agrégat est centré sur le concept de journal quotidien.
1.  **Initialisation Quotidienne :** Au début de chaque journée, un `DailyCareJournal` vide doit être créé et ajouté à l'agrégat via `addDailyJournal`.
2.  **Enregistrement des Événements :** Tout au long de la journée, les cliniciens utilisent des méthodes comme `addMonitoringValueToJournal` ou `addActionToJournal` pour enregistrer chaque action (un traitement administré) et chaque observation (une nouvelle mesure, un nouveau signe clinique).
3.  **Mise à Jour de l'État :** Lorsqu'une nouvelle donnée est ajoutée au journal, l'agrégat met également à jour l'entité `currentState`. Par exemple, si une nouvelle mesure de poids est ajoutée au journal, la valeur du poids dans `currentState` est également mise à jour. Cela permet d'avoir à tout moment un aperçu de l'état le plus récent du patient.
4.  **Archivage :** À la fin de la journée (ou au début de la suivante), l'ancien `currentDailyJournal` est archivé dans la liste `dailyJournals`, et un nouveau journal pour le jour présent est créé.

## 4. Logique Métier et Gestion d'État

- **Cycle de Vie :** L'agrégat gère le cycle de vie complet de la session de soins. Elle commence en statut `IN_PROGRESS` et se termine lorsque la méthode `endCareSession()` est appelée, passant le statut à `COMPLETED` et définissant une date de fin.
- **Changement d'Orientation :** La méthode `changeOrientationResult` permet de modifier la décision d'orientation initiale, ce qui peut entraîner un changement dans les phases de soins planifiées.
- **Validation :** La méthode `validate` s'assure qu'on ne peut pas ajouter de données au journal si le journal du jour n'a pas été créé, garantissant ainsi le respect du processus.

## 5. Création et Sous-Modules

- **Création par une Factory :** L'agrégat n'a pas de méthode statique `create`. Sa construction est complexe et est gérée par une `PatientCareSessionFactory`, qui est responsable de l'assemblage initial de toutes les pièces (phases de soins, état initial, etc.).
- **Sous-Modules :** Les concepts comme `CarePhase`, `DailyCareJournal`, `PatientCurrentState`, ainsi que les modèles pour les `medicines`, `milk`, etc., sont définis dans des sous-modules dédiés au sein de `core/nutrition_care/domain/modules/`, montrant la grande richesse et la complexité de ce contexte délimité.
