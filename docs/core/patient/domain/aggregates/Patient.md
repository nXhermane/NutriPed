# Patient (Aggregate Root)

**Fichier Source:** `core/patient/domain/models/aggregates/Patient.ts`

## 1. Vue d'Ensemble

L'entité `Patient` est la **Racine d'Agrégat** (Aggregate Root) pour le module `Patient`. Elle représente un patient unique dans le système et encapsule toutes les données démographiques et administratives le concernant, ainsi que les règles métier associées.

En tant qu'Aggregate Root, `Patient` est responsable de maintenir son propre état de cohérence et de publier des événements de domaine pour signaler les changements importants.

## 2. Structure et Propriétés (`IPatient`)

Le `Patient` est un excellent exemple de composition d'objets de domaine. Ses propriétés ne sont pas des types primitifs, mais des [ValueObjects](../../../shared/domain/common/ValueObject.md) qui garantissent la validité et la richesse sémantique de chaque attribut.

| Propriété          | Type                                       | Description                                          |
| ------------------ | ------------------------------------------ | ---------------------------------------------------- |
| `name`             | `FullName`                                 | Le nom complet du patient.                           |
| `gender`           | `Gender`                                   | Le sexe du patient.                                  |
| `birthday`         | `Birthday`                                 | La date de naissance du patient.                     |
| `parents`          | `{ mother?: FullName, father?: FullName }` | Les noms des parents.                                |
| `contact`          | `Contact`                                  | Les informations de contact (email, téléphone).      |
| `address`          | `Address`                                  | L'adresse du patient.                                |
| `registrationDate` | `DomainDate`                               | La date d'enregistrement du patient dans le système. |

Cette approche garantit qu'il est impossible de créer un `Patient` avec un email invalide ou une date de naissance incohérente, car la validation est intégrée dans les `ValueObjects` eux-mêmes.

## 3. Création de l'Agrégat (`create` static method)

La création d'un `Patient` est un processus contrôlé par la méthode statique `create`. Cette méthode de fabrique orchestre la validation et la construction de l'entité.

```typescript
static create(createProps: CreatePatientProps, id: AggregateID): Result<Patient>
```

Le processus est le suivant :

1.  **Entrée :** La méthode prend un DTO `createProps` contenant des données brutes (des `string` principalement).
2.  **Validation par `ValueObject` :** Elle tente de créer chaque `ValueObject` un par un (`FullName.create`, `Birthday.create`, etc.). Chaque création de `ValueObject` retourne un `Result`.
3.  **Combinaison des Résultats :** Elle utilise `Result.combine([...])` pour vérifier que la création de **tous** les `ValueObjects` a réussi.
4.  **Décision :**
    - Si un seul `Result` est un échec, `Result.combine` retourne ce premier échec, et la méthode `create` du `Patient` retourne immédiatement ce `Result.fail`.
    - Si tous les `Results` sont des succès, la méthode procède à l'instanciation de `new Patient(...)`.
5.  **Gestion des Exceptions :** Le tout est encapsulé dans un bloc `try...catch` qui utilise `handleError` pour transformer toute exception inattendue en un `Result.fail`.

Ce processus garantit qu'un `Patient` ne peut être créé que s'il est dans un état parfaitement valide.

## 4. Logique Métier et Invariants

### Méthodes de Modification (`change...`)

L'état d'un `Patient` ne peut pas être modifié directement. Il faut passer par des méthodes publiques qui expriment une intention métier claire, comme `changeBirthday(birthday: Birthday)`.

Ces méthodes ont une double responsabilité :

1.  Modifier la propriété interne.
2.  Appeler `this.validate()` pour vérifier les invariants de l'agrégat.
3.  Publier un événement de domaine si le changement est significatif.

### Invariants de l'Agrégat (`validate()`)

En plus des validations assurées par les `ValueObjects`, l'agrégat `Patient` a sa propre règle de validation : l'âge du patient ne doit pas dépasser la constante `PATIENT_MAX_AGE_IN_YEAR`. Cette règle est vérifiée dans la méthode `validate()`, qui est appelée après chaque modification.

## 5. Événements de Domaine

Le `Patient` publie plusieurs événements pour informer le reste du système des changements importants de son cycle de vie :

- **`PatientCreatedEvent`**
  - **Déclenché par :** La méthode `created()` (un hook de cycle de vie appelé par le constructeur de `Entity`).
  - **Contient :** L'ID du patient, son sexe et sa date de naissance.

- **`PatientDeletedEvent`**
  - **Déclenché par :** La méthode `delete()`.
  - **Contient :** L'ID du patient.

- **`PatientAgeOrGenderUpdatedEvent`**
  - **Déclenché par :** Les méthodes `changeBirthday()` et `changeGender()`.
  - **Raison :** L'âge et le sexe sont des données critiques pour de nombreuses évaluations nutritionnelles. Cet événement permet aux autres modules (comme `Evaluation`) de savoir que des calculs pourraient devoir être mis à jour.
  - **Contient :** L'ID du patient, son sexe et sa date de naissance.
