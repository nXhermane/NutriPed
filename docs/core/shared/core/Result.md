# Result & Either

**Fichier Source:** `core/shared/core/Result.ts`

Ce fichier fournit deux patrons de conception pour la gestion des opérations qui peuvent échouer, permettant d'éviter l'utilisation d'exceptions pour le contrôle de flux.

## 1. La Classe `Result<T>`

`Result<T>` est une classe qui encapsule le résultat d'une opération. Le résultat est soit un **succès**, contenant une valeur de type `T`, soit un **échec**, contenant une erreur. Cela rend la signature d'une méthode explicite sur sa capacité à échouer.

### 1.1. Comment ça marche ?

Un objet `Result` a deux états possibles :

- `isSuccess = true` et `isFailure = false`
- `isSuccess = false` et `isFailure = true`

Plutôt que de faire un `return` ou de `throw new Error()`, une méthode retourne une instance de `Result`.

### 1.2. Création d'un `Result`

La création se fait via deux méthodes statiques :

- **`Result.ok<U>(value?: U): Result<U>`** : Crée un `Result` de succès.

  ```typescript
  // Retourne un Result<number> en cas de succès
  function divide(a: number, b: number): Result<number> {
    if (b === 0) {
      // Géré dans le cas suivant
    }
    return Result.ok(a / b);
  }
  ```

- **`Result.fail<U>(error: string): Result<U>`** : Crée un `Result` d'échec.
  ```typescript
  function divide(a: number, b: number): Result<number> {
    if (b === 0) {
      return Result.fail<number>("Cannot divide by zero.");
    }
    return Result.ok(a / b);
  }
  ```

### 1.3. Utilisation d'un `Result`

L'appelant est forcé de vérifier l'état du résultat avant d'en utiliser la valeur.

```typescript
const result = divide(10, 2);

if (result.isSuccess) {
  // On accède à la valeur avec .val
  console.log(`Result is: ${result.val}`); // "Result is: 5"
}

if (result.isFailure) {
  // On accède à l'erreur avec .err
  console.error(`Error: ${result.err}`);
}
```

> **Attention :** L'accesseur `.val` lèvera une exception si vous essayez de l'appeler sur un résultat d'échec. C'est une approche "fail-fast" pour garantir une utilisation correcte.

### 1.4. Méthodes Utilitaires

- **`Result.combine(results: Result<any>[]): Result<any>`**
  Combine plusieurs résultats en un seul. Très utile pour valider plusieurs champs à la fois. Si un seul des résultats est un échec, `combine` retourne ce premier échec. Si tous réussissent, il retourne un `Result.ok()`.

  ```typescript
  const nameResult = validateName(name); // Result<string>
  const emailResult = validateEmail(email); // Result<Email>

  const combined = Result.combine([nameResult, emailResult]);
  if (combined.isFailure) {
    // Si le nom ou l'email est invalide
    return combined;
  }
  ```

- **`Result.encapsulate<U>(func: () => U): Result<U>`**
  Exécute une fonction dans un bloc `try...catch` et retourne automatiquement `Result.ok` avec la valeur de retour, ou `Result.fail` avec le message d'erreur si une exception est levée.

---

## 2. Le Type `Either<L, R>`

`Either` est un type issu de la programmation fonctionnelle. Il représente une valeur qui peut être de l'un des deux types possibles : `Left` ou `Right`. Par convention :

- **`Right`** est utilisé pour le cas de succès.
- **`Left`** est utilisé pour le cas d'erreur.

C'est une alternative à `Result`, souvent considérée comme plus pure d'un point de vue fonctionnel.

### 2.1. Implémentation

- **`Either<L, A>`** : Un alias de type pour `Left<L, A> | Right<L, A>`.
- **`Left<L, A>`** : Une classe qui contient la valeur d'erreur de type `L`.
- **`Right<L, A>`** : Une classe qui contient la valeur de succès de type `A`.

### 2.2. Création et Utilisation

La création se fait via les fonctions `left` et `right`.

```typescript
import { Either, left, right } from "@core/shared/core";

function parseJson(input: string): Either<Error, object> {
  try {
    const parsed = JSON.parse(input);
    return right(parsed); // Succès
  } catch (e) {
    return left(new Error("Invalid JSON")); // Échec
  }
}

const result = parseJson('{ "a": 1 }');

if (result.isRight()) {
  // result est de type Right<Error, object>
  console.log(result.value); // { a: 1 }
}

if (result.isLeft()) {
  // result est de type Left<Error, object>
  console.error(result.value.message);
}
```

Les méthodes `isRight()` et `isLeft()` sont des "type guards" qui permettent à TypeScript de savoir quel type se trouve dans `result.value`.
