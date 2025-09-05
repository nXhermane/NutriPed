# Entity

**Fichier Source:** `core/shared/domain/common/Entity.ts`

## 1. Vue d'Ensemble

Une **Entity** (Entité) est un autre concept central de l'approche Domain-Driven Design (DDD). Contrairement à un [ValueObject](./ValueObject.md), une Entité possède une **identité unique** qui lui est propre et qui persiste dans le temps, même si ses autres attributs changent. C'est cette identité qui la définit.

Dans ce projet, les Entités sont les objets principaux du domaine (ex: `Patient`, `NutritionalDiagnostic`). Elles encapsulent un état, des règles métier (invariants) et une identité.

**Caractéristiques principales :**

- **Identité Unique :** Chaque entité est identifiable de manière unique grâce à un `id`.
- **Cycle de Vie :** Une entité est créée, peut être modifiée, et éventuellement supprimée. Son identité reste la même tout au long de ce cycle.
- **Égalité par l'Identité :** Deux entités sont considérées comme égales si et seulement si elles ont le même `id`.
- **Mutable (de manière contrôlée) :** L'état d'une entité (ses `props`) peut changer au fil du temps.

## 2. Implémentation de Base (`Entity<T>`)

Le projet fournit une classe de base abstraite `Entity<EntityProps>` que toutes les entités concrètes doivent étendre.

```typescript
export abstract class Entity<EntityProps extends EntityPropsBaseType> {
  private readonly _id: EntityUniqueID;
  private readonly _createdAt: DomainDate;
  private _updatedAt: DomainDate;
  protected _domainEvents: DomainEvent<object>[] = [];
  public readonly props: EntityProps;

  constructor({
    id,
    props,
    createdAt,
    updatedAt,
  }: CreateEntityProps<EntityProps>) {
    this._id = new EntityUniqueID(id);
    this._createdAt = DomainDate.create(createdAt).val;
    this._updatedAt = DomainDate.create(updatedAt).val;
    this.props = this.createProxy(props); // Crée un proxy pour les props
    this.validate(); // Valide les règles métier
  }

  public abstract validate(): void;

  // ... autres méthodes
}
```

### 2.1. Propriétés Fondamentales

- `_id`: Un `EntityUniqueID`, qui est un Value Object encapsulant l'ID de l'entité.
- `_createdAt`, `_updatedAt`: Des `DomainDate` (Value Objects) qui tracent la création et la dernière modification de l'entité.
- `props`: Un objet contenant tous les attributs de l'entité.
- `_domainEvents`: Un tableau pour stocker les événements de domaine (`DomainEvent`) générés par l'entité.
- `_isDeleted`: Un booléen pour gérer la suppression logique (soft delete).

### 2.2. Mise à Jour Automatique de `updatedAt` grâce à un Proxy

Une des fonctionnalités les plus intelligentes de cette classe de base est l'utilisation d'un **Proxy** JavaScript sur l'objet `props`.

```typescript
private createProxy(props: EntityProps): EntityProps {
  return new Proxy(props, this.handler());
}

private handler(): ProxyHandler<EntityProps> {
  const handler: ProxyHandler<EntityProps> = {
    set: (target, key, newValue) => {
      const isSuccess = Reflect.set(target, key, newValue);
      if (isSuccess) this._updatedAt = new DomainDate(); // Mise à jour automatique !
      return isSuccess;
    },
  };
  return handler;
}
```

Ce mécanisme intercepte toute tentative de modification d'une propriété de l'entité (`props.someValue = ...`). Si la modification réussit, il met automatiquement à jour le champ `_updatedAt` avec la date et l'heure actuelles. Cela garantit que le timestamp de dernière modification est toujours fiable, sans que le développeur ait à y penser.

## 3. Méthodes Clés

### `equals(obj?: Entity<EntityProps>): boolean`

La méthode de comparaison fondamentale pour une entité. Elle retourne `true` si les deux objets sont des entités et qu'ils partagent le même `_id`.

```typescript
const patient1 = Patient.create({ id: "uuid-1", props: { name: "Alice" } });
const patient2 = Patient.create({ id: "uuid-1", props: { name: "Bob" } }); // Même ID, autre nom
const patient3 = Patient.create({ id: "uuid-2", props: { name: "Alice" } });

console.log(patient1.equals(patient2)); // true, car l'ID est le même
console.log(patient1.equals(patient3)); // false, car l'ID est différent
```

### `validate(): void`

Une méthode **abstraite** que chaque entité concrète doit implémenter. Elle contient les règles métier (invariants) qui doivent toujours être vraies pour que l'entité soit dans un état valide. Cette méthode est appelée automatiquement par le constructeur. Si un invariant est violé, elle doit lever une exception.

### `getProps(): EntityProps & BaseEntityProps`

Retourne une copie "gelée" (immuable) de toutes les propriétés de l'entité, y compris `id`, `createdAt`, et `updatedAt`. C'est la manière sécurisée d'accéder à l'état de l'entité depuis l'extérieur.

### `delete(): void`

Implémente la suppression logique (soft delete). Elle ne supprime pas l'objet, mais passe le drapeau `_isDeleted` à `true`.

### `created(): void` et `updated(): void`

Ce sont des "hooks" de cycle de vie. Ce sont des méthodes vides dans la classe de base, mais elles peuvent être surchargées dans les classes filles pour ajouter des `DomainEvent` lorsque l'entité est créée ou mise à jour.

## 4. Exemple d'Utilisation

Voici un exemple simple d'une entité `User`.

```typescript
// 1. Définir les props de l'entité
interface UserProps {
  email: Email; // Utilise un Value Object pour l'email
  name: FullName; // et pour le nom
  isActive: boolean;
}

// 2. Créer la classe et étendre Entity
export class User extends Entity<UserProps> {
  private constructor(props: CreateEntityProps<UserProps>) {
    super(props);
  }

  // 3. Implémenter la méthode de validation
  public validate(): void {
    // Exemple d'invariant : on pourrait vérifier une logique complexe ici
    // Si une règle est violée, on lève une exception.
    if (this.props.name.unpack().firstName.length < 2) {
      throw new Error("First name is too short.");
    }
    this._isValid = true;
  }

  // 4. Créer une méthode statique "create"
  public static create(props: CreateEntityProps<UserProps>): User {
    // On pourrait ajouter de la logique ici avant de créer l'instance
    return new User(props);
  }

  // 5. Logique métier propre à l'entité
  public deactivate(): void {
    this.props.isActive = false;
    // La date `updatedAt` sera mise à jour automatiquement par le proxy
  }
}
```

Cette classe de base `Entity` fournit un cadre de travail puissant et sécurisé pour modéliser les concepts clés du domaine.
