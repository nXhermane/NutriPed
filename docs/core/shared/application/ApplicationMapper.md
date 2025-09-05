# ApplicationMapper

**Fichier Source:** `core/shared/application/Mapper.ts`

## 1. Vue d'Ensemble

Un **Mapper** est un patron de conception essentiel dans une architecture en couches. Son rôle est de **convertir des objets d'un modèle à un autre**. Cette conversion est cruciale pour maintenir une séparation stricte entre les différentes couches de l'application (domaine, application, infrastructure, présentation).

L'interface `ApplicationMapper` définit un contrat spécifique pour un type de mapper : celui qui convertit un objet du **domaine** (comme une [Entity](../domain/common/Entity.md) ou un [ValueObject](../domain/common/ValueObject.md)) en un **DTO (Data Transfer Object)** destiné à la couche de présentation (UI, API, etc.).

## 2. Rôle et Objectif

L'objectif principal de l'`ApplicationMapper` est de créer une "barrière" protectrice autour du domaine.
- **Exposition Sélective :** Il permet de n'exposer que les données nécessaires à l'extérieur, en cachant les détails d'implémentation, l'état interne complexe et les méthodes de l'objet de domaine.
- **Prévention des Fuites d'Abstraction :** Il empêche le modèle de domaine de "fuiter" dans les couches externes. L'interface utilisateur n'a pas besoin de connaître les `ValueObjects` ou les règles de validation complexes d'une entité.
- **Formatage des Données :** Il peut être utilisé pour formater les données dans un format pratique pour l'affichage (par exemple, convertir un objet `Date` en une chaîne de caractères lisible).

## 3. Définition de l'Interface

L'interface est simple et directe :

```typescript
export interface ApplicationMapper<
  DomainEntity extends Entity<EntityPropsBaseType> | ValueObject<any>,
  Dto extends object,
> {
  toResponse(entity: DomainEntity): Dto;
}
```
- **`ApplicationMapper<DomainEntity, Dto>`** : L'interface est générique :
    - `DomainEntity` : Le type de l'objet de domaine source (une `Entity` ou un `ValueObject`).
    - `Dto` : Le type de l'objet de transfert de données (DTO) de destination.

- **`toResponse(entity: DomainEntity): Dto`** : La seule méthode de l'interface. Elle prend une instance de l'objet de domaine et retourne le DTO correspondant.

> **Note :** Ce projet définit d'autres types de mappers dans d'autres couches. Par exemple, la couche d'infrastructure (`adapter`) aura des mappers pour convertir les DTOs de persistance (venant de la base de données) en entités de domaine, et vice-versa. `ApplicationMapper` est spécifiquement pour la conversion **Domaine -> Réponse**.

## 4. Exemple d'Implémentation

Voici un exemple conceptuel de `PatientMapper` qui convertit une entité `Patient` en un `PatientResponseDTO`.

```typescript
// Le DTO de réponse, un simple objet de données
export interface PatientResponseDTO {
  id: string;
  fullName: string;
  age: number;
}

// L'entité de domaine, avec sa logique et ses Value Objects
export class Patient extends AggregateRoot<PatientProps> {
  get name(): FullName { return this.props.name; }
  get birthDate(): BirthDate { return this.props.birthDate; }
  // ... autres logiques
}


// L'implémentation du Mapper
import { ApplicationMapper } from '@core/shared/application';

export class PatientMapper implements ApplicationMapper<Patient, PatientResponseDTO> {

  public toResponse(entity: Patient): PatientResponseDTO {

    // Calcule l'âge à partir de la date de naissance
    const ageInYears = entity.birthDate.calculateAgeInYears();

    // Crée le DTO plat
    const patientDto: PatientResponseDTO = {
      id: entity.id.toValue(),
      fullName: entity.name.fullName, // Extrait la valeur du ValueObject
      age: ageInYears
    };

    return patientDto;
  }
}
```

Dans cet exemple, le `PatientMapper` :
- Prend une entité `Patient` complexe.
- Appelle la logique de l'entité (`calculateAgeInYears`).
- "Déballe" les `ValueObjects` (`entity.id.toValue()`, `entity.name.fullName`).
- Retourne un objet DTO simple et plat, prêt à être sérialisé en JSON et envoyé à un client.
