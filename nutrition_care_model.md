# Modèle Conceptuel pour le Contexte `nutrition_care`

Ce document décrit le modèle architectural proposé pour la gestion de la prise en charge de la malnutrition, en se concentrant sur le flux de travail en milieu hospitalier (CNT).

## 1. Diagramme de Classes (Mermaid)

Ce diagramme illustre les principaux composants du système et leurs interactions, en suivant les principes de l'Architecture Hexagonale (ou Clean Architecture).

```mermaid
classDiagram
    direction LR

    package "Couche Application (Use Cases)" {
        class AdmitPatientToCNTUseCase {
            <<Application Service>>
            +execute(request)
        }
        class RecordInpatientDailyProgressUseCase {
            <<Application Service>>
            +execute(request)
        }
        class TransferPatientToCNAUseCase {
            <<Application Service>>
            +execute(request)
        }
    }

    package "Couche Domaine" {
        class PatientCareSession {
            <<Aggregate Root>>
            -patientId: AggregateID
            -orientation: OrientationResult
            -currentPhase: CarePhase
            -currentState: PatientCurrentState
            -dailyJournals: DailyCareJournal[]
            +addMonitoringValueToJournal(entry)
            +addClinicalEventToJournal(event)
            +canTransitionToNextPhase(): boolean
            +canBeTransferredToCNA(): boolean
        }

        class DailyCareJournal {
            <<Entity>>
            -date: DomainDate
            -monitoringEntries: MonitoringEntry[]
            -clinicalEvents: ClinicalEvent[]
        }

        class PatientCurrentState {
            <<Entity>>
            -anthropometricData
            -appetiteTestResult
            -complicationData
        }

        class CarePhase {
            <<Entity>>
            -name: string
            -startDate: DomainDate
        }

        class MonitoringEntry {
            <<Value Object>>
            -code: SystemCode
            -value: any
        }

        class ClinicalEvent {
            <<Value Object>>
            -code: SystemCode
            -isPresent: boolean
        }

        class OrientationService {
            <<Domain Service>>
            +orient(context, refs): OrientationResult
        }

        class TherapeuticMilkAdvisorService {
            <<Domain Service>>
            +suggest(input, refs): MilkSuggestionResult
        }
    }

    package "Couche Infrastructure (Ports)" {
        class IPatientCareSessionRepository {
            <<Interface (Port)>>
            +findById(id): PatientCareSession
            +save(session): void
        }
    }

    ' --- Relations --- '
    AdmitPatientToCNTUseCase ..> IPatientCareSessionRepository
    AdmitPatientToCNTUseCase ..> OrientationService
    AdmitPatientToCNTUseCase ..> TherapeuticMilkAdvisorService
    AdmitPatientToCNTUseCase ..> PatientCareSession

    RecordInpatientDailyProgressUseCase ..> IPatientCareSessionRepository
    RecordInpatientDailyProgressUseCase ..> PatientCareSession

    TransferPatientToCNAUseCase ..> IPatientCareSessionRepository
    TransferPatientToCNAUseCase ..> PatientCareSession

    PatientCareSession "1" *-- "1" PatientCurrentState : contient
    PatientCareSession "1" *-- "0..*" DailyCareJournal : contient
    PatientCareSession "1" *-- "1..*" CarePhase : contient
    DailyCareJournal "1" *-- "0..*" MonitoringEntry : contient
    DailyCareJournal "1" *-- "0..*" ClinicalEvent : contient

```

### Notes de Compréhension du Diagramme

*   **Couche Application (Use Cases)** : C'est le point d'entrée de la logique métier. Chaque `UseCase` orchestre une action spécifique (ex: admettre un patient). Ils ne contiennent pas de logique métier eux-mêmes, mais savent qui appeler (services du domaine, repositories) et dans quel ordre.
*   **Couche Domaine** : C'est le cœur de votre application.
    *   `PatientCareSession` est l'**Agrégat** principal. Il garantit la cohérence de toutes les données relatives à une session de soins. Les `UseCases` chargent cet agrégat, exécutent des actions dessus, et le sauvegardent.
    *   Les **Entités** (`DailyCareJournal`, `PatientCurrentState`) ont une identité et un cycle de vie, mais n'existent qu'à l'intérieur de l'agrégat `PatientCareSession`.
    *   Les **Value Objects** (`MonitoringEntry`, `ClinicalEvent`) sont de simples conteneurs de données sans identité propre.
    *   Les **Services du Domaine** (`OrientationService`, etc.) contiennent la logique métier complexe qui ne trouve sa place dans aucune entité ou agrégat (ex: le calcul d'une orientation qui dépend de plusieurs facteurs).
*   **Couche Infrastructure (Ports)** : Elle définit les contrats (interfaces) pour les services externes, comme la base de données (`IPatientCareSessionRepository`). L'implémentation réelle (ex: avec SQLite ou IndexedDB) se trouve dans la couche `adapter` de votre projet.

Cette structure permet de garder le code métier (domaine) pur et indépendant des détails techniques (base de données, UI), ce qui le rend plus facile à tester, à maintenir et à faire évoluer.

## 2. Règles de Décision et Structures de Données

Cette section formalise la logique métier et la structure des données de référence ("données statiques") nécessaires pour prendre des décisions, comme vous l'avez vu dans le répertoire `processed_data`.

---

### **Décision 1 : Orientation du Patient (CNT vs. CNA)**

Cette logique détermine si un patient doit être traité en hospitalisation (CNT) ou en ambulatoire (CNA).

#### **Structure de Données Statique (`OrientationReference`)**

Voici un exemple de la structure JSON pour une seule règle d'orientation. Vous auriez un tableau de ces objets, un pour chaque type d'orientation possible (CNT, CNA, etc.).

```json
[
  {
    "code": "ORIENTATION_CNT",
    "name": "Orienté vers le Centre Nutritionnel Thérapeutique (CNT)",
    "admissionCriteria": [
      {
        "description": "Le test de l'appétit est un échec",
        "value": "appetite_test_result == 'FAILED'"
      },
      {
        "description": "Présence d'oedèmes",
        "value": "edema > 0"
      },
      {
        "description": "Présence de complications médicales",
        "value": "complications_number > 0"
      }
    ]
  },
  {
    "code": "ORIENTATION_CNA",
    "name": "Orienté vers le Centre Nutritionnel Ambulatoire (CNA)",
    "admissionCriteria": [
      {
        "description": "Le test de l'appétit est une réussite ET absence d'oedèmes ET absence de complications",
        "value": "appetite_test_result == 'SUCCESS' && edema == 0 && complications_number == 0"
      }
    ]
  }
]
```

#### **Règle Logique Formalisée (`OrientationService`)**

Le service d'orientation applique la logique suivante pour prendre une décision.

**Entrées :**
*   `patientContext`: Un objet contenant l'état actuel du patient (ex: `{ weight: 5.2, edema: 1, appetite_test_result: 'FAILED', complications_number: 0 }`).
*   `orientationReferences`: Le tableau de structures JSON décrit ci-dessus.

**Logique (en pseudo-code) :**

```pseudocode
function orientPatient(patientContext, orientationReferences):

  // 1. Evaluer toutes les orientations possibles
  let possibleOrientations = []
  for each ref in orientationReferences:
    isCriteriaMet = false
    for each criteria in ref.admissionCriteria:
      // La fonction 'evaluate' exécute la chaîne de caractères 'criteria.value'
      // en utilisant les variables du 'patientContext'.
      if evaluate(criteria.value, patientContext) is true:
        isCriteriaMet = true
        break // Si un critère est rempli, la référence est valide

    if isCriteriaMet:
      add ref to possibleOrientations

  // 2. S'il n'y a aucun résultat, c'est une erreur.
  if possibleOrientations is empty:
    return "Erreur: Impossible de déterminer l'orientation."

  // 3. Choisir le résultat avec la plus haute priorité.
  //    La priorité est définie comme suit : CNT > CNA > CRENAM > Domicile.
  //    Ceci garantit que si un seul critère pour le CNT est rempli,
  //    le patient sera toujours orienté vers le CNT, ce qui est la décision la plus sûre.
  let finalOrientation = selectHighestPriority(possibleOrientations)

  return finalOrientation
```

---

### **Décision 2 : Prescription de Lait Thérapeutique (Phase 1 & Transition)**

Cette logique détermine le type et la quantité de lait ou d'ATPE à donner à un patient hospitalisé.

#### **Structure de Données Statique (`MilkReference`)**

Voici un exemple de la structure JSON pour un type de lait (ex: F-75). Un autre objet similaire existerait pour le F-100, l'ATPE, etc.

```json
{
  "code": "MILK_F75",
  "type": "F-75",
  "condition": {
    "description": "Le patient est en Phase 1",
    "value": "care_phase == 'Phase 1'"
  },
  "weightRanges": [
    {
      "weightRange": { "min": 5.0, "max": 5.4 },
      "recommendedQuantityPerMeal": {
        "5_meals_per_day": 130,
        "6_meals_per_day": 110,
        "8_meals_per_day": 90
      }
    },
    {
      "weightRange": { "min": 5.5, "max": 5.9 },
      "recommendedQuantityPerMeal": {
        "5_meals_per_day": 150,
        "6_meals_per_day": 120,
        "8_meals_per_day": 100
      }
    }
  ]
}
```

#### **Règle Logique Formalisée (`TherapeuticMilkAdvisorService`)**

Le service de conseil en lait thérapeutique applique la logique suivante.

**Entrées :**
*   `patientContext`: Un objet contenant l'état actuel du patient (ex: `{ weight: 5.2, care_phase: 'Phase 1' }`).
*   `milkReferences`: Un tableau contenant les objets de référence pour chaque type de lait.

**Logique (en pseudo-code) :**

```pseudocode
function suggestMilk(patientContext, milkReferences):

  // 1. Trouver le lait approprié pour la phase actuelle du patient.
  let applicableMilk = null
  for each milk in milkReferences:
    if evaluate(milk.condition.value, patientContext) is true:
      applicableMilk = milk
      break

  if applicableMilk is null:
    return "Erreur: Aucun lait applicable pour cette phase."

  // 2. Trouver la tranche de poids correspondante dans la table du lait.
  let dosageRange = null
  for each range in applicableMilk.weightRanges:
    if patientContext.weight >= range.weightRange.min and patientContext.weight <= range.weightRange.max:
      dosageRange = range
      break

  if dosageRange is null:
    return "Erreur: Le poids du patient est en dehors des tranches définies."

  // 3. Retourner la suggestion de prescription.
  let suggestion = {
    milkType: applicableMilk.type,
    recommendedVolumes: dosageRange.recommendedQuantityPerMeal,
    // ex: { "5_meals_per_day": 130, "6_meals_per_day": 110, ... }
    availableFrequencies: keys(dosageRange.recommendedQuantityPerMeal)
  }

  return suggestion
```

---

### **Décision 3 : Transitions d'État du Patient (Logique Interne de l'Agrégat)**

Ces règles sont encapsulées directement dans l'agrégat `PatientCareSession`. Elles permettent à l'objet de connaître son propre état et de répondre à des questions sur les actions possibles.

#### **Règle 3.1 : Le patient peut-il passer en Phase de Transition ?**

**Logique (Méthode `canTransitionToNextPhase()` de `PatientCareSession`) :**

```pseudocode
function canTransitionToNextPhase():

  // Contexte: 'this' se réfère à l'instance de PatientCareSession
  let currentState = this.currentState

  // Critère 1: Le test de l'appétit est une réussite.
  let appetiteOk = (currentState.appetiteTestResult == 'SUCCESS')

  // Critère 2: Le patient est cliniquement stable (pas de complications).
  let isClinicallyStable = (currentState.complications_number == 0)

  // Critère 3: Les œdèmes ont commencé à fondre.
  // (Le protocole est vague, une interprétation simple est que l'œdème n'est plus à son maximum '+++')
  let edemaIsReducing = (currentState.edema < 3)

  return (appetiteOk AND isClinicallyStable AND edemaIsReducing)
```

#### **Règle 3.2 : Le patient peut-il être transféré vers le CNA ?**

**Logique (Méthode `canBeTransferredToCNA()` de `PatientCareSession`) :**

```pseudocode
function canBeTransferredToCNA():

  // Contexte: 'this' se réfère à l'instance de PatientCareSession
  let currentState = this.currentState

  // Critère 1: Le patient a un bon appétit.
  // (Note: le protocole mentionne ">90% de consommation d'ATPE", ce qui est une logique plus fine à implémenter.
  // Pour commencer, un test d'appétit réussi est une bonne approximation.)
  let appetiteOk = (currentState.appetiteTestResult == 'SUCCESS')

  // Critère 2: Absence totale de complications.
  let noComplications = (currentState.complications_number == 0)

  // Critère 3: Absence totale d'œdèmes.
  let noEdema = (currentState.edema == 0)

  return (appetiteOk AND noComplications AND noEdema)
```
