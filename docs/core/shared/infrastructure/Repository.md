# Repository

**Fichier Source:** `core/shared/infrastructure/Repository.ts`

## 1. Vue d'Ensemble

Le **Repository** (ou Dépôt) est un patron de conception fondamental en Domain-Driven Design qui sert de médiateur entre le domaine et la couche de persistance des données (base de données, API externe, etc.).

Son objectif est de fournir une abstraction qui donne à la couche de domaine l'illusion qu'elle travaille avec une simple collection d'objets en mémoire. Le domaine n'a aucune connaissance de la manière dont les objets sont stockés, récupérés ou supprimés. Il demande simplement au Repository de lui fournir ou de sauvegarder des entités.

Cette abstraction est l'un des piliers qui permet de garder le **domaine complètement indépendant de l'infrastructure**.

## 2. L'Interface de Base `Repository`

Ce fichier définit l'interface de base, générique, que tous les contrats de repository spécifiques doivent étendre.

```typescript
import { AggregateID, Entity, EntityPropsBaseType } from "../domain";

export interface Repository<DomainEntity extends Entity<EntityPropsBaseType>> {
  getById(id: AggregateID): Promise<DomainEntity>;
  save(entity: DomainEntity): Promise<void>;
  delete(id: AggregateID): Promise<void>;
}
```

- **`Repository<DomainEntity>`** : L'interface est générique et est typée avec l'`Entity` (ou plus spécifiquement, l'[AggregateRoot](../domain/common/AggregateRoot.md)) qu'elle est censée gérer.

- **Méthodes Fondamentales :** Elle définit trois méthodes de base pour les opérations CRUD (Create, Read, Update, Delete) :
  - **`getById(id: AggregateID): Promise<DomainEntity>`**
    Récupère une entité par son identifiant unique. Elle doit retourner une `Promise` qui se résout avec l'entité trouvée. Si l'entité n'est pas trouvée, l'implémentation doit lever une exception (typiquement une `NotFoundException`).

  - **`save(entity: DomainEntity): Promise<void>`**
    Persiste une entité. Cette méthode doit gérer à la fois la **création** d'une nouvelle entité et la **mise à jour** d'une entité existante (logique "upsert").

  - **`delete(id: AggregateID): Promise<void>`**
    Supprime une entité de la persistance en utilisant son identifiant.

## 3. Contrat vs Implémentation

Il est crucial de comprendre que cette interface est un **contrat** qui vit dans le `core` de l'application. Les **implémentations concrètes** de ce contrat se trouvent dans la couche `adapter`.

- **Le `core` définit le "quoi"** : "J'ai besoin d'un moyen de sauvegarder un Patient."
- **L'`adapter` définit le "comment"** : "Voici comment sauvegarder un Patient en utilisant une base de données SQLite sur mobile" ou "Voici comment le faire avec IndexedDB sur le web."

## 4. Exemple d'Utilisation

En général, on ne dépend pas directement de l'interface `Repository` de base. On crée une interface spécifique pour chaque Aggregate Root, qui étend l'interface de base et peut ajouter des méthodes de recherche plus spécifiques.

1.  **Création de l'interface spécifique (dans le domaine)**

    ```typescript
    // Dans core/patient/domain/ports/IPatientRepository.ts
    import { Repository } from "@core/shared/infrastructure";
    import { Patient } from "../Patient";
    import { Result } from "@core/shared/core";

    export interface IPatientRepository extends Repository<Patient> {
      // Ajout d'une méthode de recherche spécifique au patient
      findByFullName(name: FullName): Promise<Result<Patient[]>>;
    }
    ```

2.  **Utilisation dans un Cas d'Utilisation (dans l'application)**

    Le cas d'utilisation dépend de l'interface, pas de l'implémentation concrète.

    ```typescript
    // Dans core/patient/application/useCases/FindPatientUseCase.ts
    import { IPatientRepository } from '@core/patient/domain/ports';

    class FindPatientUseCase implements UseCase<...> {
      private readonly patientRepo: IPatientRepository;

      constructor(patientRepo: IPatientRepository) {
        this.patientRepo = patientRepo;
      }

      public async execute(request: ...): Promise<...> {
        const patient = await this.patientRepo.getById(request.patientId);
        // ...
      }
    }
    ```

3.  **Implémentation concrète (dans l'adapter)**

    ```typescript
    // Dans adapter/patient/infra/repository.expo/PatientRepository.ts
    import { IPatientRepository } from "@core/patient/domain/ports";

    export class PatientRepositoryExpo implements IPatientRepository {
      public async getById(id: AggregateID): Promise<Patient> {
        // Logique spécifique à Expo SQLite pour trouver un patient...
      }

      // ... implémentation des autres méthodes
    }
    ```

Ce patron de conception est essentiel pour maintenir le découplage et la testabilité de l'application.
