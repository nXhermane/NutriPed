# Aggregate Root

**Fichier Source:** `core/shared/domain/common/AggregateRoot.ts`

## 1. Vue d'Ensemble

Une **Aggregate Root** (Racine d'Agrégat) est un concept de Domain-Driven Design (DDD) qui s'appuie sur la notion d'[Entity](./Entity.md). C'est une `Entity` spécifique qui sert de point d'entrée et de gardien pour un groupe d'objets de domaine étroitement liés (appelé un **agrégat**).

Le but de l'Aggregate Root est de garantir la cohérence et l'intégrité de l'ensemble de l'agrégat. Toutes les interactions avec les objets *à l'intérieur* de l'agrégat doivent obligatoirement passer par une méthode de la Racine. La Racine s'assure alors que toutes les règles métier (invariants) de l'agrégat sont respectées avant d'autoriser un changement d'état.

Dans ce projet, les entités principales comme `Patient` ou `NutritionalDiagnostic` sont des Aggregate Roots.

**Caractéristiques principales :**
- **Hérite de `Entity` :** Une Aggregate Root est avant tout une `Entity`. Elle possède donc une identité unique, un cycle de vie, etc.
- **Gardien des Invariants :** Elle est responsable de maintenir un état cohérent pour elle-même et pour tous les objets qu'elle contient.
- **Point d'Entrée Unique :** Les objets externes ne peuvent pas détenir de référence directe vers les entités internes à l'agrégat ; ils ne peuvent interagir qu'avec la Racine.
- **Source d'Événements de Domaine :** C'est la Racine qui est responsable de publier les événements de domaine (`DomainEvent`) qui signalent des changements significatifs dans l'agrégat.

## 2. Implémentation de Base (`AggregateRoot<T>`)

La classe `AggregateRoot<EntityProps>` est une classe abstraite qui étend `Entity<EntityProps>`. Son rôle principal est d'ajouter une logique de gestion des événements de domaine.

```typescript
export abstract class AggregateRoot<
  EntityProps extends EntityPropsBaseType,
> extends Entity<EntityProps> {

  // Hérite de _domainEvents de la classe Entity

  getDomainEvents(): DomainEvent<object>[] {
    return this._domainEvents;
  }

  clearDomainEvent(): void {
    this._domainEvents = [];
  }

  protected addDomainEvent<T extends object>(
    domainEvent: DomainEvent<T>
  ): void {
    this._domainEvents.push(domainEvent);
    this.logDomainEventAdded(domainEvent);
  }

  // ...
}
```

## 3. Gestion des Événements de Domaine

La responsabilité la plus importante ajoutée par `AggregateRoot` est de servir de "collecteur" d'événements de domaine. Le flux est le suivant :

1.  **Action Métier :** Une méthode de l'Aggregate Root est appelée (par ex: `patient.admitToHospital()`).
2.  **Changement d'État et Logique :** La méthode modifie l'état de l'agrégat et vérifie les invariants.
3.  **Création de l'Événement :** Si l'action est réussie et qu'elle représente un fait métier important, la méthode crée une instance d'un `DomainEvent` (par ex: `PatientAdmittedEvent`).
4.  **Ajout de l'Événement :** La méthode appelle `this.addDomainEvent(event)` pour stocker l'événement dans le tableau `_domainEvents`.

Ces événements sont "en attente" et ne sont pas distribués immédiatement. C'est la couche d'infrastructure (typiquement, le `Repository` après avoir persisté les changements en base de données) qui se chargera de :
1.  Récupérer les événements en attente avec `getDomainEvents()`.
2.  Les distribuer aux différents "handlers" (abonnés) qui doivent réagir à cet événement.
3.  Vider la liste des événements de l'agrégat avec `clearDomainEvent()`.

Ce mécanisme permet de créer des effets de bord (side effects) de manière découplée et robuste. Par exemple, lorsqu'un patient est créé (`PatientCreatedEvent`), un autre module pourrait écouter cet événement pour envoyer un email de bienvenue, sans que le module `Patient` ait à connaître l'existence d'un service d'email.

## 4. Exemple d'Utilisation

Imaginons un agrégat `Order` (Commande) qui contient une liste d'`OrderItem` (Ligne de commande). `Order` est l'Aggregate Root.

```typescript
// OrderItem est une Entity simple, interne à l'agrégat
class OrderItem extends Entity<{ productId: string; quantity: number; price: number }> { /* ... */ }

// Order est l'Aggregate Root
class Order extends AggregateRoot<{ customerId: string; items: OrderItem[] }> {

  private constructor(props: CreateEntityProps<OrderProps>) {
    super(props);
  }

  public static create(props: CreateEntityProps<OrderProps>): Order {
    const order = new Order(props);
    // Lors de la création, on ajoute un événement de domaine
    order.addDomainEvent(new OrderCreatedEvent({ orderId: order.id }));
    return order;
  }

  public addOrderItem(product: Product, quantity: number): void {
    // Règle métier (invariant) : on ne peut pas ajouter plus de 10 lignes
    if (this.props.items.length >= 10) {
      throw new Error("Cannot add more than 10 items to an order.");
    }

    const newItem = OrderItem.create({ /* ... */ });
    this.props.items.push(newItem);

    // On ajoute un événement pour signaler ce changement
    this.addDomainEvent(new OrderItemAddedEvent({ orderId: this.id, productId: product.id }));

    // Le proxy sur `props` mettra à jour `updatedAt` automatiquement
  }
}
```

Dans cet exemple :
- `Order` contrôle l'ajout d'`OrderItem`.
- `Order` garantit le respect de l'invariant (pas plus de 10 items).
- `Order` publie des événements (`OrderCreatedEvent`, `OrderItemAddedEvent`) pour informer le reste du système de ce qui s'est passé, sans être couplé à lui.
