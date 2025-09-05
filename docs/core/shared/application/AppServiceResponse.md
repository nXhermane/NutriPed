# AppServiceResponse

**Fichier Source:** `core/shared/application/AppServiceResponse.ts`

## 1. Vue d'Ensemble

`AppServiceResponse<T>` est une interface générique très simple qui standardise la structure des réponses retournées par les services de la couche applicative, notamment les [Cas d'Utilisation](./UseCase.md).

Son unique but est d'encapsuler les données de la réponse dans une propriété `data`.

## 2. Définition de l'Interface

```typescript
export interface AppServiceResponse<T> {
  data: T;
}
```
- **`AppServiceResponse<T>`** : L'interface est générique et prend un type `T` qui représente le type des données de la réponse réelle (par exemple, un DTO, un tableau de DTOs, ou une simple valeur).

## 3. Rôle et Avantages

Même si elle est très simple, l'utilisation de cette interface comme "enveloppe" pour toutes les réponses apporte plusieurs avantages :

1.  **Cohérence de l'API :** Les clients qui consomment les services (par exemple, une application frontend) peuvent toujours s'attendre à recevoir un objet avec une clé `data`. Cela simplifie la logique de traitement des réponses côté client.

    *Sans `AppServiceResponse` :*
    - `GET /patients/1` -> `{ id: 1, name: 'John' }`
    - `GET /patients` -> `[ { id: 1, name: 'John' }, { id: 2, name: 'Jane' } ]`
    - Le client doit gérer deux formes de réponse différentes.

    *Avec `AppServiceResponse` :*
    - `GET /patients/1` -> `{ "data": { id: 1, name: 'John' } }`
    - `GET /patients` -> `{ "data": [ { id: 1, name: 'John' }, { id: 2, name: 'Jane' } ] }`
    - Le client peut toujours faire `response.data` pour accéder à la charge utile.

2.  **Extensibilité :** Cette structure facilite l'ajout de métadonnées supplémentaires aux réponses dans le futur sans casser les clients existants. On pourrait facilement enrichir la réponse plus tard :

    ```typescript
    export interface AppServiceResponse<T> {
      data: T;
      pagination?: {
        total: number;
        page: number;
        pageSize: number;
      };
      warnings?: string[];
    }
    ```

## 4. Exemple d'Utilisation

Voici comment elle pourrait être utilisée dans la définition de la réponse d'un cas d'utilisation.

```typescript
import { AppServiceResponse } from '@core/shared/application';
import { Result } from '@core/shared/core';

// Le DTO de réponse pour un patient
export interface PatientDTO {
  id: string;
  fullName: string;
}

// La réponse du UseCase qui récupère un patient
// C'est un Result qui, en cas de succès, contient une AppServiceResponse<PatientDTO>
export type GetPatientResponse = Result<AppServiceResponse<PatientDTO>>;


// Dans le UseCase...
class GetPatientUseCase implements UseCase<string, GetPatientResponse> {
  public async execute(patientId: string): Promise<GetPatientResponse> {

    // ... logique pour trouver le patient et le mapper en DTO
    const patientDto: PatientDTO = { id: patientId, fullName: "John Doe" };

    // On encapsule le DTO dans AppServiceResponse
    const response: AppServiceResponse<PatientDTO> = {
      data: patientDto
    };

    // On retourne le tout dans un Result de succès
    return Result.ok(response);
  }
}
```
Cette approche combine la robustesse de `Result` pour la gestion des succès/échecs avec la cohérence de `AppServiceResponse` pour la structure des données de succès.
