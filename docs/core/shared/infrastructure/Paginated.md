# Paginated

**Fichier Source:** `core/shared/infrastructure/Paginated.ts`

## 1. Vue d'Ensemble

`Paginated` est un alias de type simple qui définit une structure standard pour les paramètres de pagination.

Lorsque les [Repositories](./Repository.md) doivent retourner des listes de résultats potentiellement longues (par exemple, "trouver tous les patients"), il est inefficace et peu performant de tout retourner en une seule fois. La pagination est la solution à ce problème. Ce type `Paginated` est utilisé comme argument dans les méthodes de repository pour spécifier quelle "page" de résultats le client souhaite recevoir.

## 2. Définition du Type

```typescript
/**
 * @type Paginated
 * Note: used to typed the pagination params
 * @property page: is the offset
 * @property pageSize: is the limit
 */

export type Paginated = {
  page: number;
  pageSize: number;
};
```

- **`page: number`**
  Le numéro de la page de résultats demandée. En général, la première page est la page `1`. Dans une requête SQL, ce paramètre est souvent utilisé pour calculer l'`OFFSET`.
  Par exemple : `OFFSET = (page - 1) * pageSize`.

- **`pageSize: number`**
  Le nombre d'éléments à inclure dans une page. Dans une requête SQL, ce paramètre correspond directement à la clause `LIMIT`.

## 3. Exemple d'Utilisation

Voici comment le type `Paginated` serait utilisé dans l'interface d'un repository spécifique.

1.  **Définition dans l'interface du Repository**

    ```typescript
    // Dans core/patient/domain/ports/IPatientRepository.ts
    import { Paginated } from "@core/shared/infrastructure";

    export interface IPatientRepository extends Repository<Patient> {
      // ... autres méthodes

      // Une méthode pour trouver tous les patients, avec des paramètres de pagination
      findAll(params: Paginated): Promise<Patient[]>;
    }
    ```

2.  **Appel depuis un Cas d'Utilisation**

    ```typescript
    // Dans un UseCase

    // On veut la deuxième page, avec 20 patients par page
    const paginationParams: Paginated = {
      page: 2,
      pageSize: 20,
    };

    const patients = await this.patientRepo.findAll(paginationParams);
    ```

3.  **Implémentation dans le Repository Concret**

    ```typescript
    // Dans adapter/patient/infra/repository.expo/PatientRepository.ts

    public async findAll(params: Paginated): Promise<Patient[]> {
      const { page, pageSize } = params;
      const offset = (page - 1) * pageSize;

      // Logique SQL pour utiliser LIMIT et OFFSET
      const rawPatients = await this.db.query(
        'SELECT * FROM patients LIMIT ? OFFSET ?',
        [pageSize, offset]
      );

      return rawPatients.map(this.mapper.toDomain);
    }
    ```

L'utilisation de ce type standardisé rend les signatures de méthodes claires et cohérentes à travers toute l'application.
