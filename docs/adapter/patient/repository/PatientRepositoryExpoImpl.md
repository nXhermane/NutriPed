# PatientRepositoryExpoImpl

**Fichier Source:** `adapter/patient/infra/repository.expo/PatientRepository.ts`

## 1. Vue d'Ensemble

`PatientRepositoryExpoImpl` est l'implémentation **concrète** du contrat [PatientRepository](../../../core/patient/domain/ports/PatientRepository.md) pour la plateforme native (Expo). C'est cette classe qui est responsable de la persistance des agrégats `Patient` dans la base de données SQLite de l'application mobile.

Cette classe est un excellent exemple de l'efficacité du patron de conception de la classe de base de repository. Elle est extrêmement légère car toute la logique complexe et répétitive est héritée de [EntityBaseRepositoryExpo](../../shared/repository/expo/EntityBaseRepositoryExpo.md).

## 2. Implémentation

```typescript
import { Patient, PatientRepository } from "@core/patient";
import { EntityBaseRepositoryExpo } from "../../../shared";
import { PatientPersistenceDto } from "../dtos";
import { patients } from "./db";
import { AggregateID } from "@shared";

export class PatientRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    Patient,
    PatientPersistenceDto,
    typeof patients
  >
  implements PatientRepository
{
  async exist(id: AggregateID): Promise<boolean> {
    return this._exist(id);
  }
}
```

### 2.1. Héritage de `EntityBaseRepositoryExpo`

La classe étend `EntityBaseRepositoryExpo` en lui fournissant les types spécifiques dont elle a besoin :

- `Patient`: L'entité de domaine à gérer.
- `PatientPersistenceDto`: Le DTO de persistance, qui représente la structure des données dans la table de la base de données.
- `typeof patients`: Le schéma de la table Drizzle, qui définit les colonnes et les types de la table `patients`.

Grâce à cet héritage, `PatientRepositoryExpoImpl` obtient instantanément des implémentations fonctionnelles pour :

- `getById(id)`
- `getAll()`
- `save(entity)`
- `delete(id)`
- `remove(entity)`

### 2.2. Implémentation de l'Interface `PatientRepository`

La classe implémente l'interface `PatientRepository`, ce qui garantit qu'elle respecte bien le contrat défini dans le domaine.

Les seules méthodes spécifiques à `PatientRepository` qui ne sont pas dans la classe de base générique sont `exist` et `getAll` (bien que `getAll` soit aussi dans la classe de base). `PatientRepositoryExpoImpl` n'implémente que `exist`, et sa logique consiste simplement à appeler la méthode protégée `_exist` de sa classe parente.

## 3. Injection de Dépendances

Lors de l'initialisation de l'application, une instance de `PatientRepositoryExpoImpl` sera créée et injectée dans les cas d'utilisation qui dépendent de l'interface `PatientRepository`.

Le conteneur d'injection de dépendances (DI) s'assurera de fournir au constructeur de `PatientRepositoryExpoImpl` (qui est le constructeur de `EntityBaseRepositoryExpo`) les dépendances nécessaires : la connexion à la base de données, une instance du mapper `PatientMapper`, le schéma de table Drizzle, et le bus d'événements.
