# Patient Domain Events

**Dossier Source:** `core/patient/domain/events/`

## 1. Vue d'Ensemble

Ce dossier contient les [Événements de Domaine](../../../shared/domain/events/DomainEvent.md) qui sont publiés par l'agrégat [Patient](../aggregates/Patient.md). Ces événements signalent des changements importants dans le cycle de vie d'un patient, permettant à d'autres parties du système de réagir de manière découplée.

Tous les événements étendent la classe de base `DomainEvent` et définissent une interface pour leur charge utile de données (`payload`). Ils utilisent également le décorateur `@DomainEventMessage` (de la bibliothèque `domain-eventrix`) pour leur attacher des métadonnées, comme un nom lisible.

---

## 2. `PatientCreatedEvent`

**Fichier Source:** `PatientCreatedEvent.ts`

Cet événement est publié lorsqu'un nouveau patient est créé avec succès.

- **Déclenché par :** La méthode `created()` de l'agrégat `Patient`.
- **Objectif :** Informer les autres modules qu'un nouveau patient a été ajouté au système. Cela pourrait être utilisé, par exemple, pour initialiser des enregistrements dans d'autres modules (comme le dossier médical).

### Charge Utile (`PatientCreatedData`)

```typescript
export interface PatientCreatedData {
  id: AggregateID;
  sex: `${Sex}`;
  birthday: string;
}
```

---

## 3. `PatientDeletedEvent`

**Fichier Source:** `PatientDeletedEvent.ts`

Cet événement est publié juste avant qu'un patient ne soit marqué comme supprimé.

- **Déclenché par :** La méthode `delete()` de l'agrégat `Patient`.
- **Objectif :** Permettre à d'autres modules de réagir à la suppression d'un patient, par exemple pour archiver des données associées ou nettoyer des références.

### Charge Utile (`PatientDeletedData`)

```typescript
export interface PatientDeletedData {
  id: AggregateID;
}
```

---

## 4. `PatientAgeOrGenderUpdatedEvent`

**Fichier Source:** `PatientAgeOrGenderUpdatedEvent.ts`

Cet événement est publié lorsque la date de naissance ou le sexe d'un patient est modifié.

- **Déclenché par :** Les méthodes `changeBirthday()` et `changeGender()` de l'agrégat `Patient`.
- **Objectif :** C'est un événement métier critique. L'âge et le sexe sont des paramètres fondamentaux pour la plupart des évaluations nutritionnelles et des calculs de Z-Scores. Cet événement notifie les autres modules (en particulier le module `Evaluation`) que des résultats précédemment calculés pour ce patient pourraient être devenus invalides et doivent être ré-évalués.

### Charge Utile (`PatientAgeOrGenderUpdatedData`)

```typescript
export interface PatientAgeOrGenderUpdatedData {
  id: AggregateID;
  birthday: string;
  sex: `${Sex}`;
}
```
