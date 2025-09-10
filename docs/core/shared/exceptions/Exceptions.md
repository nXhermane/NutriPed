# Exceptions & Error Handling

**Dossier Source:** `core/shared/exceptions/`

## 1. Stratégie Globale de Gestion des Erreurs

Ce projet utilise une stratégie de gestion des erreurs à deux niveaux, ce qui est une pratique robuste et courante dans les architectures modernes :

1.  **Erreurs Attendues (Échecs de Domaine) :** Pour les échecs qui font partie de la logique métier normale (par exemple, un utilisateur entre un email invalide, un produit est en rupture de stock), le système utilise la classe **`Result<T>`**. Les méthodes ne lèvent pas d'exception mais retournent un `Result.fail`. C'est une manière explicite de gérer les échecs prévisibles.

2.  **Erreurs Exceptionnelles :** Pour les erreurs véritablement inattendues et non récupérables qui ne devraient pas se produire dans un système sain (par exemple, une erreur de connexion à la base de données, une violation d'un invariant de domaine critique), le système utilise des **Exceptions** personnalisées.

## 2. La Classe de Base `ExceptionBase`

Toutes les exceptions personnalisées du projet héritent de la classe de base abstraite `ExceptionBase`.

**Fichier Source:** `exception.base.ts`

```typescript
export abstract class ExceptionBase extends Error {
  abstract code: string; // Code unique pour l'erreur

  constructor(
    readonly message: string,
    readonly cause?: Error, // Pour encapsuler une autre erreur
    readonly metadata?: unknown // Pour des données de contexte supplémentaires
  ) {
    super(message);
  }

  // ... méthodes de sérialisation
}
```

**Caractéristiques Clés :**

- **`code`**: Chaque exception concrète doit définir un code unique (ex: `NOT_FOUND`). Cela permet d'identifier l'erreur de manière programmatique.
- **`cause`**: Permet d'encapsuler l'erreur originale, préservant ainsi la pile d'appels complète.
- **`metadata`**: Un champ flexible pour ajouter des informations de débogage (par exemple, les arguments de la méthode qui a échoué).
- **Sérialisation**: Les méthodes `toJSON` et `toSerialized` facilitent la journalisation (logging) des erreurs de manière structurée.

## 3. Exceptions Personnalisées

Le fichier `exceptions.ts` définit une liste complète d'exceptions sémantiques pour différents scénarios. Utiliser des exceptions spécifiques au lieu d'un `Error` générique permet de capturer et de traiter les erreurs de manière beaucoup plus fine.

**Exemples d'Exceptions :**

| Classe                         | Code                    | Quand l'utiliser ?                                                                                     |
| ------------------------------ | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| `ArgumentInvalidException`     | `ARGUMENT_INVALID`      | Un argument a un format incorrect.                                                                     |
| `ArgumentNotProvidedException` | `ARGUMENT_NOT_PROVIDED` | Un argument requis est `null` ou `undefined`.                                                          |
| `NotFoundException`            | `NOT_FOUND`             | Une entité n'a pas pu être trouvée dans la base de données.                                            |
| `ConflictException`            | `CONFLICT`              | Une tentative de création d'une ressource qui existe déjà.                                             |
| `IllegalStateException`        | `ILLEGAL_DOMAIN_STATUS` | Une action est tentée sur un objet qui n'est pas dans le bon état (ex: modifier une commande annulée). |
| `InfraMapToDomainError`        | `INFRA_MAP_FAILED`      | Le mapping entre un DTO de persistance et une entité de domaine a échoué.                              |

## 4. Le Pont entre Exceptions et `Result` : `handleError`

Alors, comment ces deux mondes (Exceptions et `Result`) coexistent-ils ? La réponse se trouve dans la fonction `handleError`.

**Fichier Source:** `handlerError.ts`

```typescript
export function handleError(error: unknown): Result<ExceptionBase | any> {
  if (error instanceof ExceptionBase) {
    return Result.fail<ExceptionBase>(`[${error.code}]:${error.message}`);
  }
  // ... autres cas
  return Result.fail<any>(`Unexpected Error : ${error}`);
}
```

Cette fonction est conçue pour être utilisée dans les blocs `catch`. Son rôle est de **transformer une exception levée en un `Result.fail`**. C'est le mécanisme qui permet aux constructeurs de `ValueObject` et aux méthodes `create` de lever des exceptions en interne pour la validation, tout en présentant une interface externe propre basée sur `Result`.

### Exemple d'utilisation dans un Value Object

```typescript
// Extrait de core/shared/domain/shared/valueObjects/Email.ts

export class Email extends ValueObject<string> {
  // ...

  // Cette méthode lève une exception si la validation échoue
  protected validate(props: ValueObjectProps<string>): void {
    if (!Email.isValidEmailFormat(props._value)) {
      throw new InvalidArgumentFormatError(
        "The email must be in a valid format."
      );
    }
  }

  // La méthode de création publique utilise try/catch et handleError
  public static create(value: string): Result<Email> {
    try {
      // Le constructeur appelle `validate` et peut donc lever une exception
      const email = new Email({ _value: value });
      return Result.ok<Email>(email);
    } catch (e: unknown) {
      // L'exception est "attrapée" et transformée en Result.fail
      return handleError(e);
    }
  }
}
```

Cette stratégie combine la puissance des exceptions pour la validation interne avec la sécurité et la clarté de l'objet `Result` pour les API publiques du domaine.
