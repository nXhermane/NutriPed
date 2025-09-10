# Guard

**Fichier Source:** `core/shared/core/Guard.ts`

## 1. Vue d'Ensemble

`Guard` est une classe statique utilitaire qui fournit un ensemble de méthodes pour la validation de données et la vérification de préconditions. Ces méthodes, souvent appelées "clauses de garde" (guard clauses), permettent de s'assurer que les données respectent certaines règles avant d'être utilisées.

L'utilisation de la classe `Guard` permet de :

- **Échouer Rapidement (Fail Fast) :** Arrêter une opération dès qu'une condition invalide est détectée.
- **Rendre le Code Plus Lisible :** Éviter les structures `if/else` imbriquées en validant les entrées au début d'une méthode.
- **Centraliser la Logique de Validation Commune :** Réutiliser des vérifications standards (null, vide, plage numérique, etc.) à travers toute l'application.

## 2. Le Type de Retour `IGuardResult`

La plupart des méthodes de `Guard` retournent un objet qui implémente l'interface `IGuardResult`:

```typescript
export interface IGuardResult {
  succeeded: boolean;
  message?: string;
}
```

- `succeeded`: Un booléen qui est `true` si la condition de la garde est respectée, et `false` sinon.
- `message`: Un message d'erreur optionnel décrivant l'échec de la validation.

## 3. Méthodes Principales

Voici une sélection des méthodes les plus utilisées, groupées par catégorie.

### 3.1. Vérifications de Nullité et de Vacuité

- **`isEmpty(value: unknown, argumentName?: string): IGuardResult`**
  Une méthode très complète qui vérifie si une valeur est "vide". Elle retourne `{ succeeded: true }` pour `null`, `undefined`, les chaînes de caractères vides, et les tableaux ou objets sans éléments. Pour les nombres et les booléens, elle retourne toujours `{ succeeded: false }`.

- **`againstNullOrUndefined(argument: unknown, argumentName: string): IGuardResult`**
  Une garde plus spécifique qui vérifie uniquement si un argument est `null` ou `undefined`.

- **`againstNullOrUndefinedBulk(args: IGuardArgument[]): IGuardResult`**
  Applique `againstNullOrUndefined` à une collection d'arguments.

### 3.2. Combinaison de Gardes

- **`combine(guardResults: IGuardResult[]): IGuardResult`**
  C'est l'une des méthodes les plus puissantes de la classe. Elle prend un tableau de résultats de gardes et les évalue.
  - Si toutes les gardes ont réussi, elle retourne `{ succeeded: true }`.
  - Si une ou plusieurs gardes ont échoué, elle retourne le **premier** résultat d'échec de la liste.

### 3.3. Vérifications de Valeur et de Plage

- **`inRange(num: number, min: number, max: number, argumentName: string): IGuardResult`**
  Vérifie si un nombre se situe dans un intervalle (inclusif).

- **`isOneOf(value: unknown, validValues: unknown[], argumentName:string): IGuardResult`**
  Vérifie si une valeur est présente dans une liste de valeurs autorisées.

- **`isNegative(num: number): IGuardResult`**
  Vérifie si un nombre est strictement inférieur à zéro.

### 3.4. Vérifications de Type

- `isString(value: unknown): IGuardResult`
- `isNumber(value: unknown): IGuardResult`
- `isObject(value: unknown): IGuardResult`

## 4. Exemple d'Utilisation

La classe `Guard` est particulièrement utile dans les constructeurs ou les méthodes `create` des [ValueObjects](../domain/common/ValueObject.md) et des [Entities](../domain/common/Entity.md) pour valider leurs propriétés.

Voici comment on pourrait créer un `ValueObject` `Age` qui doit être un nombre entre 0 et 120.

```typescript
import { Guard, IGuardResult } from "@core/shared/core/Guard";
import { Result } from "@core/shared/core/Result";
import { ValueObject } from "@core/shared/domain/common";

export class Age extends ValueObject<number> {
  private constructor(props: { _value: number }) {
    super(props);
  }

  // La méthode de validation est privée car la création est gérée par `create`
  protected validate(props: { _value: number }): void {
    // Cette méthode est toujours nécessaire, mais la logique est dans `create`
  }

  public static create(age: number): Result<Age> {
    // 1. On crée une liste de toutes les vérifications à effectuer
    const guardResults: IGuardResult[] = [
      Guard.againstNullOrUndefined(age, "age"),
      Guard.isNumber(age),
      Guard.inRange(age, 0, 120, "age"),
    ];

    // 2. On combine les résultats
    const combinedResult = Guard.combine(guardResults);

    // 3. Si une des gardes a échoué, on retourne un Result.fail
    if (!combinedResult.succeeded) {
      return Result.fail<Age>(combinedResult.message);
    }

    // 4. Si tout est valide, on crée l'instance
    return Result.ok<Age>(new Age({ _value: age }));
  }
}

// Utilisation
const validAge = Age.create(25); // Result.ok<Age>
const invalidAge = Age.create(150); // Result.fail<Age> avec le message de inRange
```

Cet exemple montre comment `Guard.combine` permet de créer un flux de validation propre et déclaratif.
