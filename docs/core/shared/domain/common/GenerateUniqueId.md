# GenerateUniqueId

**Fichier Source:** `core/shared/domain/common/GenerateUniqueID.ts`

## 1. Vue d'Ensemble

`GenerateUniqueId` est une interface simple qui définit un contrat pour un service dont l'unique responsabilité est de **générer des identifiants uniques** pour les entités.

C'est une application directe du **Principe d'Inversion des Dépendances** (le "D" de SOLID). Le domaine (`core`) exprime son besoin — "j'ai besoin d'un moyen de générer un ID unique" — en définissant cette interface. Cependant, il ne se préoccupe pas de la manière *dont* cet ID est généré (par exemple, UUID, ULID, un simple incrément, etc.). L'implémentation concrète sera fournie par une couche externe, typiquement la couche d'infrastructure (`adapter`).

## 2. Définition de l'Interface

L'interface est minimale :

```typescript
import { EntityUniqueID } from "./EntityUniqueId";

export interface GenerateUniqueId {
  generate(): EntityUniqueID;
}
```

- **`generate()`**: Une seule méthode qui ne prend aucun argument.
- **Retourne `EntityUniqueID`**: Elle retourne une instance de `EntityUniqueID`, garantissant que l'ID généré est directement compatible avec le constructeur de la classe de base `Entity`.

## 3. Avantages et Utilisation

L'utilisation de cette interface permet de découpler la logique métier de la stratégie de génération d'ID.

- **Découplage Fort :** Le code du domaine (par exemple, une [Factory](./Factory.md)) ne dépend que de l'interface `GenerateUniqueId`, pas d'une bibliothèque ou d'une technique de génération spécifique.
- **Interchangeabilité :** On peut facilement changer la manière dont les IDs sont générés sans toucher au code métier. On peut avoir une implémentation pour la production et une autre pour les tests.

### Exemple d'Implémentation et d'Injection

1.  **Implémentation dans la couche `adapter`**

   Supposons que nous utilisions la bibliothèque `uuid`.

   ```typescript
   // Dans adapter/shared/services/UUIDGenerator.ts
   import { v4 as uuidv4 } from 'uuid';
   import { GenerateUniqueId } from '@core/shared/domain/common';
   import { EntityUniqueID } from '@core/shared/domain/common';

   export class UUIDGenerator implements GenerateUniqueId {
     public generate(): EntityUniqueID {
       const uuid = uuidv4();
       return new EntityUniqueID(uuid);
     }
   }
   ```

2.  **Injection de dépendance dans une `Factory`**

   La `Factory` peut maintenant dépendre de l'interface et recevoir l'implémentation concrète via son constructeur.

   ```typescript
   // Dans core/user/application/UserFactory.ts
   import { GenerateUniqueId } from '@core/shared/domain/common';

   class UserFactory implements Factory<UserProps, User> {
     private readonly idGenerator: GenerateUniqueId;
     // ... autres dépendances

     constructor(idGenerator: GenerateUniqueId, /* ... */) {
       this.idGenerator = idGenerator;
       // ...
     }

     public async create(props: UserProps): Promise<Result<User>> {
       // ... logique de validation

       // Utilisation de l'interface pour générer l'ID
       const newId = this.idGenerator.generate();

       const user = User.create({
           id: newId.toValue(), // On extrait la valeur brute
           props: props,
       });

       return Result.ok<User>(user);
     }
   }
   ```

Grâce à cette abstraction, le code du domaine reste pur et agnostique des détails d'implémentation de l'infrastructure.
