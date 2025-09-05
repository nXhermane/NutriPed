# EntityUniqueId

**Fichier Source:** `core/shared/domain/common/EntityUniqueId.ts`

## 1. Vue d'Ensemble

La classe `EntityUniqueID` est une implémentation concrète et directe de la classe [Identifier](./Identifier.md).

Son unique rôle est de fournir un type spécifique pour les identifiants utilisés par la classe de base [Entity](./Entity.md).

```typescript
export class EntityUniqueID extends Identifier<string | number> {
  constructor(id: string | number) {
    super(id);
  }
}
```

## 2. Rôle et Utilisation

- **Héritage :** Elle hérite de toute la logique de `Identifier` (validation dans le constructeur, méthodes `equals`, `toValue`, etc.).
- **Spécialisation de Type :** Elle spécifie que l'identifiant d'une entité dans ce système peut être soit un `string`, soit un `number`.
- **Intégration avec `Entity` :** La classe `Entity` utilise `EntityUniqueID` pour typer sa propriété `_id`.

```typescript
// Extrait de la classe Entity
import { EntityUniqueID } from "./EntityUniqueId";

export abstract class Entity<EntityProps> {
  private readonly _id: EntityUniqueID;

  constructor({ id /* ... */ }: CreateEntityProps<EntityProps>) {
    this._id = new EntityUniqueID(id);
    // ...
  }
}
```

En résumé, `EntityUniqueID` est une classe "marqueur" qui donne un nom clair et un type précis (`string | number`) à l'identifiant de toutes les entités du domaine, tout en bénéficiant de la robustesse de la classe de base `Identifier`. Il n'y a pas de logique métier supplémentaire dans cette classe.
