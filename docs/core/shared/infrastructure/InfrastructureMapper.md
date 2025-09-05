# InfrastructureMapper

**Fichier Source:** `core/shared/infrastructure/Mapper.ts`

## 1. Vue d'Ensemble

L'`InfrastructureMapper` est un type de **Mapper** dont le rôle est de faire la navette entre le monde du **Domaine** et le monde de la **Persistance** (l'infrastructure). C'est un composant essentiel qui travaille en étroite collaboration avec le [Repository](./Repository.md).

Son travail consiste à traduire :
- Une **Entité de Domaine** riche et complexe en un **DTO de Persistance** plat et simple, prêt à être stocké.
- Un **DTO de Persistance** (venant de la base de données) en une **Entité de Domaine** valide et cohérente.

Cette traduction est fondamentale pour maintenir l'indépendance du domaine vis-à-vis des détails de stockage.

## 2. Définition de l'Interface

L'interface définit un contrat pour un mapping bi-directionnel :

```typescript
import { Entity, EntityPropsBaseType } from "../domain";

export interface InfrastructureMapper<
  DomainEntity extends Entity<EntityPropsBaseType>,
  PersistenceType extends object,
> {
  toPersistence(entity: DomainEntity): PersistenceType;
  toDomain(record: PersistenceType): DomainEntity;
}
```
- **`InfrastructureMapper<DomainEntity, PersistenceType>`** : L'interface est générique :
    - `DomainEntity` : Le type de l'entité de domaine.
    - `PersistenceType` : Le type du DTO de persistance (l'objet qui représente une ligne dans une table de base de données, par exemple).

- **`toPersistence(entity: DomainEntity): PersistenceType`**
  Cette méthode prend une instance de l'entité de domaine et la transforme en DTO de persistance. Cela implique généralement de :
    - "Déballer" les [ValueObjects](../domain/common/ValueObject.md) pour ne stocker que leurs valeurs primitives (ex: `FullName` -> `string`).
    - Sérialiser des objets complexes si nécessaire.

- **`toDomain(record: PersistenceType): DomainEntity`**
  Cette méthode prend un DTO de persistance (les données brutes de la base de données) et reconstruit l'entité de domaine. C'est une étape critique qui implique de :
    - Recréer les `ValueObjects` à partir des données primitives, ce qui **ré-applique les validations de domaine** et garantit que l'objet chargé en mémoire est valide.
    - Recréer l'entité elle-même en utilisant sa méthode `create` ou son constructeur.

## 3. Comparaison avec `ApplicationMapper`

Ce mapper ne doit pas être confondu avec l'[ApplicationMapper](../application/ApplicationMapper.md). Leurs rôles sont distincts :

- **`InfrastructureMapper`** :
    - **Direction :** Domaine <==> Persistance (bi-directionnel).
    - **Objectif :** Isoler le domaine des détails de stockage.
    - **Localisation :** Fait partie de la couche d'infrastructure (`adapter`).

- **`ApplicationMapper`** :
    - **Direction :** Domaine ==> DTO de Réponse (uni-directionnel).
    - **Objectif :** Exposer des données de manière sûre et pratique à la couche de présentation.
    - **Localisation :** Fait partie de la couche applicative (`core/application`).

## 4. Exemple d'Utilisation

Voici comment un `Repository` utiliserait un `InfrastructureMapper` pour implémenter sa méthode `getById`.

1.  **Le DTO de Persistance** (défini dans `adapter`)

    ```typescript
    // DTO qui correspond à la table `patients`
    interface PatientPersistenceDTO {
      id: string;
      full_name: string; // La colonne en base de données
      birth_date: string;
      gender: 'M' | 'F';
    }
    ```

2.  **L'implémentation du Mapper** (dans `adapter`)

    ```typescript
    class PatientMapper implements InfrastructureMapper<Patient, PatientPersistenceDTO> {

      public toPersistence(entity: Patient): PatientPersistenceDTO {
        return {
          id: entity.id.toValue(),
          full_name: entity.name.fullName,
          birth_date: entity.birthDate.toISOString(),
          gender: entity.gender.toPersistenceValue() // ex: 'Male' -> 'M'
        };
      }

      public toDomain(record: PatientPersistenceDTO): Patient {
        return Patient.create({
          id: record.id,
          props: {
            name: FullName.create(record.full_name).val,
            birthDate: BirthDate.create(record.birth_date).val,
            gender: Gender.fromPersistence(record.gender).val
          }
        });
      }
    }
    ```

3.  **Utilisation dans le Repository** (dans `adapter`)

    ```typescript
    class PatientRepositoryExpo implements IPatientRepository {
      private readonly db: Database;
      private readonly mapper: PatientMapper;

      constructor(db: Database, mapper: PatientMapper) {
        this.db = db;
        this.mapper = mapper;
      }

      public async getById(id: AggregateID): Promise<Patient> {
        // 1. Récupérer les données brutes de la base de données
        const rawPatient = await this.db.query('SELECT * FROM patients WHERE id = ?', [id]);
        if (!rawPatient) { throw new NotFoundException(); }

        // 2. Utiliser le mapper pour convertir les données brutes en une entité de domaine
        const domainPatient = this.mapper.toDomain(rawPatient);

        return domainPatient;
      }
      // ...
    }
    ```
Ce découplage est la clé d'une architecture propre et testable.
