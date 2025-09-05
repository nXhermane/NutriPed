# CreatePropsDto

**Fichier Source:** `core/shared/application/CreatePropsDto.ts`

## 1. Vue d'Ensemble

`CreatePropsDto<T>` est une interface générique qui établit une convention pour la structure des **DTOs (Data Transfer Objects)** utilisés dans les cas d'utilisation de création.

Son rôle est double :
1.  Standardiser la forme des requêtes de création en encapsulant les données dans une propriété `data`.
2.  Garantir, au niveau du typage, que les DTOs de création ne contiennent que les propriétés qu'un client est autorisé à fournir.

## 2. Définition de l'Interface

```typescript
export interface CreatePropsDto<T> {
  data: Omit<T, "id" | "createdAt" | "updatedAt">;
}
```

### 2.1. La Puissance de `Omit<T, K>`

La caractéristique la plus importante de cette interface est l'utilisation de l'utilitaire de type `Omit` de TypeScript.

- **`Omit<T, "id" | "createdAt" | "updatedAt">`** : Cette expression crée un nouveau type à partir d'un type existant `T` en enlevant un ensemble de propriétés spécifiées.

Dans le contexte de l'application :
- `T` est généralement l'interface des `props` d'une [Entité](../domain/common/Entity.md) de domaine (par exemple, `PatientProps`).
- Le DTO de création ne doit **pas** inclure les propriétés `id`, `createdAt`, et `updatedAt`. Ces valeurs ne sont pas fournies par le client ; elles sont générées et gérées par le système :
    - `id` est généré par un service (voir [GenerateUniqueId](../domain/common/GenerateUniqueId.md)).
    - `createdAt` et `updatedAt` sont gérées automatiquement par la classe de base `Entity`.

`CreatePropsDto` utilise `Omit` pour faire respecter cette règle fondamentale au niveau du typage, ce qui empêche les développeurs de faire des erreurs et rend l'intention du code beaucoup plus claire.

## 3. Exemple d'Utilisation

Imaginons une entité `Patient` dont les `props` sont définies comme suit :

```typescript
// Dans le domaine (ex: core/patient/domain/Patient.ts)
export interface PatientProps {
  id: EntityUniqueId;
  createdAt: DomainDate;
  updatedAt: DomainDate;
  name: FullName;
  birthDate: BirthDate;
  gender: Gender;
}
```

Maintenant, pour créer le DTO de la requête du cas d'utilisation `CreatePatient`, on peut utiliser `CreatePropsDto` :

```typescript
// Dans la couche applicative (ex: core/patient/application/useCases/CreatePatientUseCase.ts)
import { CreatePropsDto } from '@core/shared/application';
import { PatientProps } from '@core/patient/domain';

// On définit le DTO de requête en utilisant l'interface partagée
export type CreatePatientRequestDTO = CreatePropsDto<PatientProps>;
```

Le type `CreatePatientRequestDTO` sera alors équivalent à :

```typescript
// Type résultant (généré par TypeScript)
type CreatePatientRequestDTO = {
  data: {
    // Les props de PatientProps, SAUF id, createdAt, et updatedAt
    name: FullName;
    birthDate: BirthDate;
    gender: Gender;
  }
}
```

Le compilateur TypeScript lèvera une erreur si on essaie de construire un objet `CreatePatientRequestDTO` qui inclut `id`, `createdAt`, ou `updatedAt` dans sa propriété `data`, renforçant ainsi la robustesse et la correction de l'architecture.
