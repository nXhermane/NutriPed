# Identifier

**Fichier Source:** `core/shared/domain/common/Identifier.ts`

## 1. Vue d'Ensemble

La classe `Identifier<T>` est une classe utilitaire générique qui sert à encapsuler une valeur d'identification (comme un `string` ou un `number`). On peut la voir comme une forme très simple et spécialisée de [ValueObject](./ValueObject.md).

Son objectif principal est de donner un **sens sémantique** et une **sécurité de typage** à des valeurs qui, autrement, seraient de simples primitives.

Par exemple, au lieu de manipuler des `string` partout pour représenter les IDs des patients et des produits, on peut créer des classes `PatientId` et `ProductId` qui étendent `Identifier<string>`. Le système de typage de TypeScript empêchera alors d'assigner accidentellement un `ProductId` à une variable qui attend un `PatientId`, même si les deux sont des chaînes de caractères sous-jacentes.

## 2. Implémentation de Base

La classe est très simple :

```typescript
export class Identifier<T> {
  constructor(private value: T) {
    if (Guard.isEmpty(value).succeeded) {
      throw new ArgumentInvalidException("Please enter the valid identifier");
    }
    this.value = value;
  }

  // ... méthodes
}
```

- **Constructeur :** Il prend une valeur de type `T` et utilise `Guard.isEmpty` pour s'assurer que la valeur n'est ni `null`, ni `undefined`, ni une chaîne vide. Si la valeur est invalide, il lève une `ArgumentInvalidException`.
- **`value` :** La valeur brute de l'identifiant est stockée dans une propriété `private`, ce qui la rend immuable de l'extérieur.

## 3. Méthodes Clés

### `equals(id?: Identifier<T>): boolean`

Effectue une comparaison sécurisée. Elle vérifie que :

1. L'objet `id` à comparer n'est pas `null` ou `undefined`.
2. L'objet `id` est bien une instance de la même classe d'identifiant.
3. Les valeurs sous-jacentes des deux identifiants sont égales.

### `toValue(): T`

Retourne la valeur brute (primitive) de l'identifiant.

### `toString(): string`

Retourne la représentation en chaîne de caractères de la valeur de l'identifiant.

## 4. Exemple d'Utilisation

Voici comment on pourrait créer un identifiant spécifique pour un `Patient`.

```typescript
import { Identifier } from "@core/shared/domain/common";

// On crée une classe spécifique pour l'ID du Patient
// On ne lui ajoute aucune logique, on hérite simplement de Identifier
export class PatientId extends Identifier<string> {
  constructor(value: string) {
    super(value);
  }
}

// Utilisation
const id1 = new PatientId("patient-123");
const id2 = new PatientId("patient-123");
const id3 = new PatientId("patient-456");

// Un autre type d'ID
class ProductId extends Identifier<string> {
  constructor(value: string) {
    super(value);
  }
}
const productId = new ProductId("product-abc");

console.log(id1.equals(id2)); // true
console.log(id1.equals(id3)); // false

// Le code suivant produirait une erreur de typage, ce qui est le but !
// let somePatientId: PatientId = productId; // Error: Type 'ProductId' is not assignable to type 'PatientId'.
```

En utilisant cette classe, on rend le code du domaine plus expressif, plus sûr et moins sujet aux erreurs.
