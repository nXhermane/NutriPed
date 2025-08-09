# Modèle Conceptuel Détaillé pour `nutrition_care` (V2)

Ce document est un guide d'architecture et d'implémentation pour le module `nutrition_care`, en réponse à votre demande de modélisation détaillée.

## 1. Principes d'Architecture & Diagramme du Modèle

### Question : Agrégat "Anémique" ou "Riche" ?

Vous avez demandé si la logique d'évaluation devait être dans l'agrégat `PatientCareSession` ou dans un service, et si votre implémentation actuelle était "anémique". C'est une excellente question fondamentale en architecture logicielle.

*   **Modèle Anémique** : C'est un anti-pattern où les objets du domaine (comme `PatientCareSession`) ne contiennent que des données (propriétés, getters, setters) et aucune logique métier. Toute la logique est déportée dans des services. Le risque est d'aboutir à des scripts procéduraux qui manipulent des sacs de données, perdant les avantages de l'orientation objet.
*   **Modèle Riche** : C'est l'idéal de la Conception Pilotée par le Domaine (DDD), où les objets du domaine (les agrégats) contiennent à la fois les données et la logique métier qui opère sur ces données. L'agrégat est le garant de sa propre consistance et de ses règles internes.

**Votre implémentation actuelle est bonne.** Elle n'est pas anémique. Un agrégat ne doit pas tout faire. La meilleure approche est un équilibre :

1.  **L'Agrégat (`PatientCareSession`)** doit être responsable de sa **cohérence interne**. Par exemple, la méthode `addDailyJournal` vérifie que le journal est bien celui du jour. Les méthodes `canTransitionToNextPhase` que nous avons conçues sont aussi de bons exemples de logique interne, car elles répondent à une question sur l'état propre de l'agrégat.
2.  Les **Services de Domaine** sont utilisés pour la **logique métier complexe** qui :
    *   Coordonne plusieurs agrégats (non applicable ici, mais c'est un cas d'usage courant).
    *   Dépend de données externes (comme les `OrientationReferences` ou `MilkReferences`).
    *   Implique des calculs complexes qui ne sont pas directement liés à l'état interne d'un seul agrégat.

**Conclusion et Proposition :**
Gardons votre approche. La logique de décision qui compare l'état du patient à des **références externes** (les fichiers JSON de règles) doit rester dans des **Services de Domaine**. C'est propre et maintenable. Pour clarifier le calcul des variables dynamiques, je propose d'introduire un service dédié à cette tâche : le `PatientStateEvaluatorService`.

### Diagramme de Classes V2

Ce diagramme mis à jour inclut le `PatientStateEvaluatorService` et clarifie les dépendances.

```mermaid
classDiagram
    direction LR

    subgraph "Couche Application"
        class AdmitPatientToCNTUseCase
        class RecordInpatientDailyProgressUseCase
    end

    subgraph "Couche Domaine"
        class PatientCareSession {
            <<Aggregate Root>>
            +dailyJournals: DailyCareJournal[]
            +currentState: PatientCurrentState
        }
        class DailyCareJournal {
            <<Entity>>
            +date: DomainDate
            +monitoringEntries: MonitoringEntry[]
        }
        class PatientCurrentState {
            <<Entity>>
            +weight: number
            +edema: number
        }
        class PatientStateEvaluatorService {
            <<Domain Service>>
            +generateContext(session): PatientContext
        }
        class OrientationService {
            <<Domain Service>>
            +orient(context, refs): OrientationResult
        }
    end

    subgraph "Contexte d'Évaluation"
        class PatientContext {
            <<DTO>>
            +weight: number
            +edema: number
            +weight_gain_g_kg_day: number
            +is_losing_weight_2_weeks: boolean
        }
    end

    ' --- Relations --- '
    RecordInpatientDailyProgressUseCase ..> PatientCareSession : "Charge & Sauvegarde"
    RecordInpatientDailyProgressUseCase ..> PatientStateEvaluatorService : "Utilise"
    PatientStateEvaluatorService ..> PatientCareSession : "Lit"
    PatientStateEvaluatorService ..> PatientContext : "Crée"

    RecordInpatientDailyProgressUseCase ..> OrientationService : "Utilise"
    OrientationService ..> PatientContext : "Utilise"

```
**Notes sur le Diagramme V2 :**
*   Le `RecordInpatientDailyProgressUseCase` (ou un cas d'utilisation similaire) fait d'abord appel au `PatientStateEvaluatorService`.
*   Ce service prend la `PatientCareSession` avec tout son historique (`dailyJournals`) et produit un `PatientContext` simple.
*   Ce `PatientContext` contient non seulement les données brutes (`weight`) mais aussi les **variables dynamiques calculées** (`weight_gain_g_kg_day`).
*   Enfin, ce `PatientContext` est passé aux autres services de domaine comme `OrientationService` pour évaluer les règles, qui deviennent ainsi beaucoup plus simples.

## 2. Gestion de l'État et Variables Dynamiques

Pour évaluer les règles complexes du protocole (ex: "perte de poids sur 2 visites consécutives"), nous avons besoin de plus que les données brutes de la visite du jour. Nous devons calculer des **variables dynamiques** basées sur l'historique du patient.

C'est le rôle du `PatientStateEvaluatorService`.

### Le `PatientContext` : L'Objet d'Évaluation

Avant chaque évaluation de règles, le `PatientStateEvaluatorService` génère un objet simple, le `PatientContext`. Cet objet contient toutes les informations nécessaires, statiques et dynamiques.

**Structure du `PatientContext` :**
C'est un simple objet clé-valeur.
Exemple: `{ "weight": 7.5, "edema": 0, "weight_gain_rate_g_kg_day": 5.1, ... }`

**Liste des Variables du Contexte :**

| Variable                          | Type    | Description                                                                 |
| --------------------------------- | ------- | --------------------------------------------------------------------------- |
| **--- Statiques ---**             |         | (Données brutes de la visite actuelle)                                      |
| `weight`                          | Nombre  | Poids actuel en kg.                                                         |
| `height`                          | Nombre  | Taille actuelle en cm.                                                      |
| `muac`                            | Nombre  | Périmètre brachial en mm.                                                   |
| `edema`                           | Nombre  | Niveau d'œdème (0, 1, 2, 3).                                                |
| `temperature`                     | Nombre  | Température corporelle en °C.                                               |
| `appetite_test_result`            | Chaîne  | Résultat du test d'appétit ('SUCCESS' ou 'FAILED').                         |
| `complications_number`            | Nombre  | Nombre de complications médicales actives.                                  |
| `care_phase`                      | Chaîne  | Phase de soin actuelle ('Phase 1', 'Transition').                           |
| `days_in_program`                 | Nombre  | Nombre total de jours depuis l'admission.                                   |
| **--- Dynamiques ---**            |         | (Calculées par le service à partir de l'historique)                         |
| `weight_gain_rate_g_kg_day`       | Nombre  | Taux de gain de poids en grammes par kilo par jour depuis la dernière visite. |
| `is_losing_weight`                | Booléen | Vrai si le poids a baissé depuis la dernière visite.                        |
| `has_lost_weight_2_visits`        | Booléen | Vrai si le poids a baissé lors des deux dernières visites consécutives.     |
| `is_weight_stagnant_3_visits`     | Booléen | Vrai si le poids n'a pas augmenté significativement sur 3 visites.          |

### Pseudo-Code du `PatientStateEvaluatorService`

Ce service contient la logique pour calculer les variables dynamiques.

```pseudocode
class PatientStateEvaluatorService:

  function generateContext(session: PatientCareSession): PatientContext

    // 1. Initialiser le contexte avec les données statiques de l'état actuel.
    let context = {
      weight: session.currentState.weight,
      height: session.currentState.height,
      muac: session.currentState.muac,
      edema: session.currentState.edema,
      temperature: session.currentState.temperature,
      appetite_test_result: session.currentState.appetiteTestResult,
      complications_number: session.currentState.complications.length,
      care_phase: session.currentPhase.name,
      days_in_program: daysBetween(session.startDate, today)
    }

    // 2. Récupérer l'historique des journaux pour les calculs.
    let journals = session.dailyJournals

    // 3. Calculer les variables dynamiques (exemples).
    if journals.length > 1:
      let lastJournal = journals[journals.length - 2] // L'avant-dernier journal
      let previousWeight = lastJournal.getWeight()
      let daysSinceLastVisit = daysBetween(lastJournal.date, today)

      if previousWeight and daysSinceLastVisit > 0:
        // Formule du gain de poids
        let gain_in_grams = (context.weight - previousWeight) * 1000
        context.weight_gain_rate_g_kg_day = (gain_in_grams / previousWeight) / daysSinceLastVisit

      context.is_losing_weight = (context.weight < previousWeight)

    // (Logique similaire pour 'has_lost_weight_2_visits', etc.
    // en regardant plus loin dans l'historique des journaux)

    return context

```
Cette approche centralise la logique de calcul complexe, rendant les services de règles (comme `OrientationService`) très simples : ils reçoivent un contexte déjà prêt à l'emploi et n'ont plus qu'à évaluer des conditions simples.

## 3. Formalisation Complète des Règles de Prise en Charge (Enfants > 6 mois)

Cette section détaille la logique pour chaque étape du flux de travail au CNT.

---

### **3.1 Admission au CNT**

*Alias: Orientation vers le CNT*

#### **Critères du Protocole (Tableau 12 & 21)**
Un patient est admis au CNT si **au moins un** des critères suivants est rempli :
*   Le test de l'appétit est un échec (`Echec ou test de l’appétit ambigu`).
*   Présence d'œdèmes bilatéraux, quel que soit leur degré.
*   Présence d'au moins une complication médicale grave (selon les critères PCIME).
*   Le choix de l'accompagnant est pour le CNT.

#### **Structure de Données Statique**
La structure `OrientationReference` décrite à la section 2.1 est utilisée ici.

#### **Pseudo-code du Service (`OrientationService.orient`)**
Le pseudo-code de la section 2.1 s'applique directement. Le service évalue les conditions JSON par rapport au `PatientContext` et retourne `ORIENTATION_CNT` si l'un des critères ci-dessus est vrai.

---

### **3.2 Échec du Traitement en Phase 1**

Cette logique permet de détecter si un patient ne répond pas correctement au traitement de stabilisation.

#### **Critères du Protocole (Tableau 25)**
Un patient est considéré en échec en Phase 1 si **au moins un** des critères suivants est rempli :
*   Absence de retour de l'appétit au 4ème jour (`Absence d’amélioration ou de retour de l’appétit`).
*   Absence totale de perte d'œdèmes au 4ème jour.
*   Présence d'œdèmes persistants au 10ème jour.
*   Ne remplit pas les critères de passage en Phase de Transition au 10ème jour.
*   Détérioration de l'état clinique à n'importe quel moment.

#### **Structure de Données Statique**
Pas de structure de données statique nécessaire. La logique est entièrement basée sur l'état du patient et des seuils de temps.

#### **Pseudo-code du Service (`CheckTreatmentFailureService.checkPhase1Failure`)**

**Entrées :**
*   `session`: L'objet `PatientCareSession` complet.
*   `context`: Le `PatientContext` généré pour la journée en cours.

**Logique (en pseudo-code) :**

```pseudocode
function checkPhase1Failure(session, context):

  let failures = []
  let daysInPhase1 = daysBetween(session.currentPhase.startDate, today)

  // Règle 1: Appétit
  if daysInPhase1 >= 4 and context.appetite_test_result == 'FAILED':
    failures.push("Absence de retour de l'appétit au 4ème jour.")

  // Règle 2: Œdèmes au jour 4
  if daysInPhase1 >= 4:
    let initialEdema = session.getInitialEdema() // Méthode à créer sur l'agrégat
    if context.edema >= initialEdema:
      failures.push("Absence de perte d'œdèmes au 4ème jour.")

  // Règle 3: Œdèmes au jour 10
  if daysInPhase1 >= 10 and context.edema > 0:
    failures.push("Présence d'œdèmes persistants au 10ème jour.")

  // Règle 4: Transition au jour 10
  // On utilise la méthode de l'agrégat que nous avons conçue !
  if daysInPhase1 >= 10 and session.canTransitionToNextPhase() is false:
    failures.push("Ne remplit pas les critères de transition au 10ème jour.")

  // Règle 5: Détérioration clinique (exemple simple)
  if context.is_losing_weight is true and context.edema == 0:
    // Perte de poids chez un enfant non-œdémateux est un signe de détérioration
    failures.push("Détérioration clinique (perte de poids).")

  return failures // Retourne une liste des raisons de l'échec
```

---

### **3.3 Transition de la Phase 1 à la Phase de Transition**

Cette logique est appelée chaque jour pour voir si le patient est assez stable pour commencer la phase de récupération nutritionnelle.

#### **Critères du Protocole (§ 4.31.4)**
*   Retour de l'appétit.
*   Début de la fonte des œdèmes.
*   Le patient a récupéré cliniquement (absence de complications).

#### **Pseudo-code du Service (`CheckPatientStateService.shouldTransitionToNextPhase`)**
Cette logique est très simple car nous avons déjà placé l'intelligence dans l'agrégat.

```pseudocode
function shouldTransitionToNextPhase(session: PatientCareSession):

  // Le service délègue simplement l'appel à l'agrégat.
  // L'agrégat est le seul expert de son propre état.
  return session.canTransitionToNextPhase()

```

---

### **3.4 Transfert du CNT au CNA**

Cette logique détermine si un patient hospitalisé est prêt à continuer son traitement en ambulatoire.

#### **Critères du Protocole (§ 4.34.5)**
*   Un bon appétit (consommation d'au moins 90% de l'ATPE).
*   Fonte totale des œdèmes.
*   Absence de complications médicales.
*   L'accompagnant donne son accord.

#### **Pseudo-code du Service (`CheckPatientStateService.shouldBeTransferredToCNA`)**
De même, le service utilise la méthode de l'agrégat.

```pseudocode
function shouldBeTransferredToCNA(session: PatientCareSession):

  // La logique complexe est déjà dans l'agrégat.
  // Note: La règle des 90% d'ATPE consommé nécessiterait une logique
  // plus fine dans la méthode de l'agrégat, en analysant les actions
  // enregistrées dans les journaux récents.
  return session.canBeTransferredToCNA()

```

---

### **3.5 Guérison (Critères de Sortie du Programme)**

Cette logique, bien que plus souvent appliquée en CNA, définit quand un patient est considéré comme guéri et peut quitter le programme.

#### **Critères du Protocole (Tableau 20)**
Un patient est guéri si :
*   (IPT ≥ -1.5 z-score PENDANT 2 semaines consécutives) OU (PB > 125 mm)
*   ET
*   Absence d'œdèmes pendant 14 jours.

#### **Structure de Données Statique (`ZScoreReferenceTable`)**
L'évaluation de l'IPT (Indice Poids/Taille) nécessite des tables de référence de l'OMS, qui mappent un poids et une taille à un z-score.

```json
{
  "sex": "male",
  "height_cm": 75.0,
  "scores": {
    "-3_zscore_weight_kg": 7.6,
    "-2_zscore_weight_kg": 8.3,
    "-1.5_zscore_weight_kg": 8.6,
    "median_weight_kg": 9.3
    // ...
  }
}
```

#### **Pseudo-code du Service (`CheckCureStatusService.isCured`)**

```pseudocode
function isCured(session, context, zscore_tables):

  // Critère 1: Absence d'œdèmes
  let noEdemaFor14Days = session.hasNoEdemaFor(14) // Méthode à créer sur l'agrégat

  if not noEdemaFor14Days:
    return false

  // Critère 2.1: Z-score
  let zscore = calculateZScore(context.weight, context.height, zscore_tables)
  let hasGoodZScore = (zscore >= -1.5)
  // Il faut aussi vérifier que cette condition était vraie lors de la visite précédente.
  let hasGoodZScoreFor2Weeks = hasGoodZScore and session.hadGoodZScoreLastVisit()

  // Critère 2.2: Périmètre brachial
  let hasGoodMUAC = (context.muac > 125)

  return (hasGoodZScoreFor2Weeks or hasGoodMUAC)
```

## 4. Formalisation des Règles pour les Nourrissons (< 6 mois ou < 3 kg)

Cette section décrit le protocole spécial pour les très jeunes nourrissons, qui est centré sur la restauration de l'allaitement maternel exclusif.

---

### **4.1 Admission des Nourrissons**

#### **Critères du Protocole (Tableau 28)**
Un nourrisson de moins de 6 mois est admis si **au moins un** des critères suivants est rempli :
*   Le nourrisson est jugé "trop faible pour téter efficacement".
*   Le nourrisson ne prend pas de poids (constaté par un suivi de croissance).
*   Son Indice Poids/Taille (IPT) est inférieur à -3 z-score.
*   Présence d'œdèmes bilatéraux.

#### **Pseudo-code du Service (`CheckInfantAdmissionService.shouldBeAdmitted`)**
```pseudocode
function shouldBeAdmitted(context):

  // La plupart des critères sont directs.
  let isAdmitted = (
    context.is_too_weak_to_suckle or
    context.is_weight_faltering or
    context.zscore < -3 or
    context.edema > 0
  )
  return isAdmitted
```

---

### **4.2 Logique de la Technique de Supplémentation par Succion (TSS)**

L'objectif est de supplémenter le nourrisson tout en stimulant la production de lait de la mère, pour ensuite sevrer le supplément.

#### **Structure de Données Statique (`InfantSupplementReference`)**
Cette structure définit le volume de supplément à donner en fonction du poids.

```json
{
  "weightRanges": [
    { "weightRange": { "min": 1.8, "max": 2.1 }, "volume_ml_per_meal": 40 },
    { "weightRange": { "min": 2.2, "max": 2.4 }, "volume_ml_per_meal": 45 }
    // ... basé sur le Tableau 29
  ]
}
```
*Note : Le lait utilisé est du **F-75** si œdèmes, sinon du **F-100 dilué** ou un lait 1er âge.*

#### **Pseudo-code du Service (`ManageInfantSupplementService.determineNextAction`)**

Ce service est appelé quotidiennement pour décider comment ajuster le traitement.

**Entrées :**
*   `session`: L'objet `PatientCareSession` du nourrisson.
*   `supplementRef`: La table de référence des dosages.

**Logique (en pseudo-code) :**
```pseudocode
function determineNextAction(session, supplementRef):

  let twoDaysHistory = session.getWeightHistory(2) // Récupère les poids des 2 derniers jours

  // Critère 1: Le nourrisson prend-il du poids de manière satisfaisante ?
  // Le protocole dit "gagne 20g par jour pendant 2 jours consécutifs"
  let hasGoodWeightGain = (twoDaysHistory[1].weight - twoDaysHistory[0].weight >= 20) and
                          (today.weight - twoDaysHistory[1].weight >= 20)

  let currentSupplementDose = session.currentSupplementDose

  // Décision d'ajustement
  if currentSupplementDose == '100%' and hasGoodWeightGain:
    // Le nourrisson récupère bien, on peut essayer de diminuer le supplément.
    return "SET_DOSE_50%"

  else if currentSupplementDose == '50%' and hasGoodWeightGain:
    // Le gain de poids est maintenu avec un supplément réduit.
    // La production de la mère a probablement augmenté. On arrête le supplément.
    return "SET_DOSE_0%" // (Allaitement exclusif)

  else if currentSupplementDose == '50%' and not hasGoodWeightGain:
    // Le gain de poids n'est pas maintenu avec la dose réduite.
    // On augmente à nouveau pour ne pas prendre de risque.
    return "SET_DOSE_75%"

  else:
    // Pas de changement, on continue avec la dose actuelle.
    return "MAINTAIN_CURRENT_DOSE"

```

---

### **4.3 Sortie du Programme pour les Nourrissons**

#### **Critères du Protocole (Tableau 31)**
Un nourrisson peut sortir du programme si :
*   Il gagne du poids en étant **uniquement allaité** (après arrêt de la TSS).
*   Il n'a pas de problème médical.
*   *Note : Il n'y a pas de critère anthropométrique de sortie (z-score ou PB).*

#### **Pseudo-code (`CheckInfantDischargeService.canBeDischarged`)**
```pseudocode
function canBeDischarged(session):

  let isGainingWeight = session.isGainingWeightOnExclusiveBreastfeeding() // Méthode à créer
  let noMedicalIssues = (session.currentState.complications_number == 0)

  return (isGainingWeight and noMedicalIssues)
```
