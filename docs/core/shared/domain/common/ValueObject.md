# Value Object

**Fichier Source:** `core/shared/domain/common/ValueObject.ts`

## 1. Vue d'Ensemble

Un **Value Object** (Objet-Valeur) est un concept fondamental de l'approche Domain-Driven Design (DDD). Il représente un élément descriptif du domaine qui n'a pas d'identité propre. On s'intéresse à ce qu'il _est_, et non à _qui_ il est. Les Value Objects sont définis par leurs attributs ; deux Value Objects sont considérés comme égaux si tous leurs attributs sont identiques.

Dans ce projet, les Value Objects sont massivement utilisés pour encapsuler la logique de validation et garantir que les données qui circulent dans le domaine sont toujours valides.

**Caractéristiques principales :**

- **Immutabilité :** Une fois créé, un Value Object ne peut plus être modifié.
- **Validation :** Il se valide lui-même lors de sa création.
- **Égalité structurelle :** Il se compare par la valeur de ses attributs, non par sa référence en mémoire.

## 2. Implémentation de Base (`ValueObject<T>`)

Le projet fournit une classe de base abstraite `ValueObject<T>` qui doit être étendue par tous les Value Objects concrets.

```typescript
export abstract class ValueObject<T> {
  protected readonly props: Readonly<ValueObjectProps<T>>;

  constructor(props: ValueObjectProps<T>) {
    this.checkIfEmpty(props); // Vérifie que les props ne sont pas vides
    this.validate(props); // Valide les règles métier
    this.props = Object.freeze(props); // Rend l'objet immuable
  }

  protected abstract validate(props: Readonly<ValueObjectProps<T>>): void;

  // ... autres méthodes
}
```

### 2.1. Construction et Validation

Le constructeur orchestre deux étapes cruciales :

1.  **`checkIfEmpty(props)`** : Vérifie que les propriétés fournies ne sont ni `null` ni `undefined`. Si c'est le cas, une `ArgumentNotProvidedException` est levée.
2.  **`validate(props)`** : Méthode abstraite que chaque Value Object concret **doit implémenter**. C'est ici que se trouvent les règles métier (invariants) de l'objet. Si une règle n'est pas respectée, cette méthode doit lever une exception (par exemple, `InvalidPropsException`).
3.  **`Object.freeze(props)`** : Après une validation réussie, les propriétés sont "gelées", ce qui empêche toute modification ultérieure.

### 2.2. Gestion des Primitives de Domaine

Le système fait une distinction entre :

- **Value Objects complexes** : Objets avec plusieurs propriétés (ex: `FullName` avec `firstName` et `lastName`).
- **Domain Primitives** : Value Objects qui n'encapsulent qu'une seule valeur primitive (`string`, `number`, `boolean`). Pour ces derniers, la valeur est stockée dans une propriété `_value`.

Cette distinction est gérée automatiquement par la classe de base.

## 3. Méthodes Clés

### `equals(vo?: ValueObject<T>): boolean`

Compare l'instance actuelle avec un autre Value Object. La comparaison est "structurelle", c'est-à-dire qu'elle vérifie si les propriétés des deux objets sont identiques.

```typescript
const email1 = Email.create({ _value: "test@test.com" });
const email2 = Email.create({ _value: "test@test.com" });
const email3 = Email.create({ _value: "autre@test.com" });

console.log(email1.equals(email2)); // true
console.log(email1.equals(email3)); // false
```

### `unpack(): T`

Permet d'extraire la valeur brute (primitive ou objet) encapsulée dans le Value Object.

```typescript
const fullName = FullName.create({ firstName: "John", lastName: "Doe" });
const rawProps = fullName.unpack();
// rawProps = { firstName: 'John', lastName: 'Doe' }

const email = Email.create({ _value: "test@test.com" });
const rawEmail = email.unpack();
// rawEmail = 'test@test.com'
```

### `isValid(): boolean`

Une méthode utilitaire qui vérifie si le Value Object est valide en exécutant la logique de `validate()` dans un bloc `try...catch`. Elle retourne `true` si valide, `false` sinon, sans lever d'exception.

## 4. Exemple d'Utilisation

Voici comment créer un Value Object concret `PositiveNumber` qui étend `ValueObject<number>`.

```typescript
// 1. Importer les dépendances nécessaires
import { ValueObject } from "@core/shared/domain/common";
import { InvalidPropsException } from "@core/shared/exceptions";

// 2. Définir les props (ici, une primitive)
type PositiveNumberProps = {
  _value: number;
};

// 3. Créer la classe et étendre ValueObject
export class PositiveNumber extends ValueObject<number> {
  private constructor(props: PositiveNumberProps) {
    super(props);
  }

  // 4. Implémenter la méthode de validation
  protected validate(props: PositiveNumberProps): void {
    if (props._value <= 0) {
      throw new InvalidPropsException("Number must be positive.");
    }
  }

  // 5. Créer une méthode statique "create" pour la construction
  public static create(value: number): PositiveNumber {
    const props = { _value: value };
    return new PositiveNumber(props);
  }
}

// Utilisation
try {
  const validNumber = PositiveNumber.create(10); // OK
  console.log(validNumber.unpack()); // 10

  const invalidNumber = PositiveNumber.create(-5); // Lèvera une InvalidPropsException
} catch (error) {
  console.error(error.message); // "Number must be positive."
}
```

Ce patron de conception est essentiel pour construire un domaine riche, sécurisé et auto-documenté.
