# Factory

**Fichier Source:** `core/shared/domain/common/Factory.ts`

## 1. Vue d'Ensemble

Le patron de conception **Factory** (Fabrique) est utilisé en Domain-Driven Design pour encapsuler la logique de création d'objets, en particulier des objets complexes comme les [Entities](./Entity.md) et les [Aggregate Roots](./AggregateRoot.md).

L'objectif est de séparer la responsabilité de la création d'un objet de l'objet lui-même. C'est utile lorsque :
- Le processus de création est complexe et ne se résume pas à un simple appel de constructeur.
- La création nécessite des dépendances que l'on ne souhaite pas injecter dans l'objet de domaine lui-même (par exemple, un service pour générer un ID unique, ou un repository pour vérifier une condition).
- On veut s'assurer que l'objet est toujours créé dans un état cohérent et valide.

Ce projet définit une interface générique `Factory` pour standardiser l'implémentation de ce patron.

## 2. Définition de l'Interface

L'interface est simple et générique :

```typescript
export interface Factory<
  Props extends EntityPropsBaseType,
  T extends Entity<EntityPropsBaseType>,
> {
  create(props: Props): Result<T> | Promise<Result<T>>;
}
```

- **`Factory<Props, T>`** : L'interface est générique avec deux types :
    - `Props` : Le type des données nécessaires à la création de l'objet.
    - `T` : Le type de l'`Entity` qui sera retournée par la fabrique.

- **`create(props: Props)`** : La seule méthode de l'interface. Elle prend les `props` en argument et retourne le résultat de la création.

### Le Type de Retour : `Result<T> | Promise<Result<T>>`

Le type de retour est un des aspects les plus importants de cette interface :

- **`Result<T>`** : Au lieu de retourner directement l'objet `T` ou de lever une exception, la méthode retourne un objet `Result`. La classe `Result` est un conteneur qui représente explicitement soit un succès (contenant l'objet `T`), soit un échec (contenant une erreur). Cela force l'appelant à gérer les deux cas et rend le code plus robuste. (La classe `Result` sera documentée séparément).

- **`Promise<...>`** : Le retour peut être encapsulé dans une `Promise`. Cela reconnaît que le processus de création peut être **asynchrone**. Par exemple, la fabrique pourrait avoir besoin de faire un appel à une base de données pour s'assurer qu'un nom d'utilisateur est unique avant de créer un nouvel utilisateur.

## 3. Exemple d'Utilisation

Imaginons une `UserFactory` qui doit s'assurer que l'email d'un nouvel utilisateur n'est pas déjà utilisé avant de créer l'entité `User`.

```typescript
// Interface du repository (couche d'infrastructure)
interface IUserRepository {
  existsByEmail(email: Email): Promise<boolean>;
  // ...
}

// L'entité User
class User extends AggregateRoot<UserProps> { /* ... */ }

// La Factory concrète qui implémente l'interface
class UserFactory implements Factory<UserProps, User> {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  public async create(props: UserProps): Promise<Result<User>> {
    // 1. Logique de validation qui dépend de l'infrastructure
    const emailExists = await this.userRepository.existsByEmail(props.email);
    if (emailExists) {
      // 2. Retourner un échec explicite
      return Result.fail<User>(new Error("Email already in use."));
    }

    // 3. Créer l'entité (par exemple, via une méthode statique)
    const user = User.create({
        id: generateNewId(), // On pourrait aussi utiliser un service pour ça
        props: props,
    });

    // 4. Retourner un succès explicite
    return Result.ok<User>(user);
  }
}
```

Dans cet exemple :
- La complexité de la vérification de l'email est sortie de l'entité `User` elle-même.
- La `UserFactory` orchestre la création, en utilisant des dépendances d'infrastructure (`IUserRepository`).
- Le résultat est retourné de manière asynchrone et sécurisée grâce à `Promise<Result<User>>`.
