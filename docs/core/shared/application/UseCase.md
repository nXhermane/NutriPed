# UseCase (Cas d'Utilisation)

**Fichier Source:** `core/shared/application/UseCase.ts`

## 1. Vue d'Ensemble

Le **Cas d'Utilisation** (ou _Interactor_) est un patron de conception au cœur de l'Architecture Propre (Clean Architecture) et de l'Architecture Hexagonale. Il représente une **action métier unique et complète** que le système peut effectuer. C'est le point d'entrée principal pour toute interaction initiée par l'extérieur (comme une interface utilisateur, une API, ou un script) avec le cœur de l'application (`core`).

**Rôle et Responsabilités :**

- **Orchestration :** Un cas d'utilisation ne contient pas de logique métier complexe lui-même. Son rôle est d'orchestrer le flux de données :
  1.  Il reçoit des données brutes en entrée (DTO).
  2.  Il utilise les `Repositories` pour récupérer les entités de domaine nécessaires.
  3.  Il appelle les méthodes sur ces entités pour exécuter la logique métier.
  4.  Il utilise à nouveau les `Repositories` pour persister les changements.
  5.  Il retourne des données en sortie (DTO), souvent un `Result`.
- **Isolation :** Il isole la logique de domaine de la logique de présentation et de l'infrastructure. L'interface utilisateur ne sait pas comment une action est effectuée, elle sait seulement quel cas d'utilisation appeler.

## 2. Définition de l'Interface

L'interface `UseCase` est simple, générique et élégante :

```typescript
export interface UseCase<IRequest, IResponse> {
  execute(request?: IRequest): Promise<IResponse> | IResponse;
}
```

- **`UseCase<IRequest, IResponse>`** : L'interface est générique et prend deux types :
  - `IRequest` : Le type de l'objet de requête (DTO - Data Transfer Object) qui contient toutes les données nécessaires pour exécuter le cas d'utilisation.
  - `IResponse` : Le type de la réponse retournée. C'est souvent un `Result<T>` pour gérer explicitement les succès et les échecs.

- **`execute(request?: IRequest)`** : La seule et unique méthode du cas d'utilisation.
  - Elle prend la requête en paramètre (optionnelle pour les cas d'utilisation qui ne nécessitent pas d'entrée, comme "Lister tous les patients").
  - Le type de retour `Promise<IResponse> | IResponse` indique que l'exécution peut être soit synchrone, soit asynchrone (ce qui est le cas le plus fréquent, car elle interagit souvent avec la base de données).

## 3. Exemple d'Implémentation

Voici un exemple conceptuel de ce à quoi pourrait ressembler un cas d'utilisation pour créer un patient.

```typescript
// 1. Définir les DTOs (Data Transfer Objects) pour la requête et la réponse
export interface CreatePatientRequestDTO {
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: "Male" | "Female";
}

// La réponse est un Result qui contient soit l'ID du nouveau patient, soit une erreur.
export type CreatePatientResponse = Result<string>;

// 2. Implémenter l'interface UseCase
import { Patient } from "@core/patient/domain";
import { IPatientRepository } from "@core/patient/domain/ports";
import { IIdGenerator } from "@core/shared/domain/common";

export class CreatePatientUseCase
  implements UseCase<CreatePatientRequestDTO, CreatePatientResponse>
{
  // 3. Injecter les dépendances (repositories, services, etc.)
  private readonly patientRepository: IPatientRepository;
  private readonly idGenerator: IIdGenerator;

  constructor(
    patientRepository: IPatientRepository,
    idGenerator: IIdGenerator
  ) {
    this.patientRepository = patientRepository;
    this.idGenerator = idGenerator;
  }

  // 4. Implémenter la logique d'orchestration dans execute()
  public async execute(
    request: CreatePatientRequestDTO
  ): Promise<CreatePatientResponse> {
    try {
      // Étape 1 : Validation des entrées (peut être fait dans un Value Object)
      const fullNameResult = FullName.create(
        request.firstName,
        request.lastName
      );
      const birthDateResult = BirthDate.create(request.birthDate);

      const combined = Result.combine([fullNameResult, birthDateResult]);
      if (combined.isFailure) {
        return Result.fail<string>(combined.err);
      }

      // Étape 2 : Création de l'entité de domaine
      const newPatient = Patient.create({
        id: this.idGenerator.generate(),
        props: {
          name: fullNameResult.val,
          birthDate: birthDateResult.val,
          // ...
        },
      });

      // Étape 3 : Persistance via le repository
      await this.patientRepository.save(newPatient);

      // Étape 4 : Retourner la réponse
      return Result.ok<string>(newPatient.id.toValue());
    } catch (e) {
      // Gérer les erreurs inattendues
      return Result.fail<string>(e.message);
    }
  }
}
```

Ce patron de conception est fondamental pour maintenir le code organisé, testable et évolutif. Chaque fichier de cas d'utilisation est une description claire et isolée d'une fonctionnalité du système.
