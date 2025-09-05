# EntityBaseRepositoryExpo

**Fichier Source:** `adapter/shared/repository.expo/EntityBaseRepository.ts`

## 1. Vue d'Ensemble

`EntityBaseRepositoryExpo` est une classe de base générique et abstraite qui constitue le **socle de la persistance des données pour la plateforme native (Expo)**.

Son rôle est de fournir une implémentation standard et réutilisable des opérations de base d'un [Repository](../../../core/shared/infrastructure/Repository.md). Les repositories concrets (comme `PatientRepositoryExpoImpl`) héritent de cette classe pour obtenir toute la logique CRUD (Create, Read, Update, Delete) sans avoir à la réécrire.

Cette classe utilise l'**ORM Drizzle** configuré pour **Expo SQLite**, ce qui montre comment la couche d'`adapter` connecte le domaine aux technologies concrètes.

## 2. Dépendances et Construction

Pour fonctionner, la classe de base a besoin de plusieurs dépendances injectées via son constructeur :

- **`expo: SQLiteDatabase`**: L'instance de la base de données fournie par `expo-sqlite`.
- **`mapper: InfrastructureMapper<...>`**: Le mapper spécifique à l'entité, qui sait comment convertir l'entité de domaine en DTO de persistance, et vice-versa.
- **`table: TableSchema`**: Le schéma de la table Drizzle correspondant à l'entité.
- **`eventBus: IEventBus | null`**: Une instance optionnelle du bus d'événements, nécessaire pour la publication des événements de domaine.

## 3. Implémentation des Méthodes du Repository

### `save(entity)`
Implémente une logique de **"upsert"** :
1.  Utilise la méthode protégée `_exist()` pour vérifier si une entité avec le même ID existe déjà.
2.  Si elle n'existe pas, elle effectue une requête `db.insert(...)`.
3.  Si elle existe, elle effectue une requête `db.update(...)`.
4.  **Publication d'événements :** Après la sauvegarde, si l'entité est une `AggregateRoot`, elle récupère les événements de domaine en attente (`entity.getDomainEvents()`) et les publie immédiatement sur l'event bus.

### `getById(id)`
1.  Utilise `db.select().from(this.table).where(eq(this.table.id, id))` pour trouver l'enregistrement.
2.  Si aucun enregistrement n'est trouvé, elle lève une `RepositoryNotFoundError`.
3.  Si un enregistrement est trouvé, elle utilise le `mapper` pour le convertir en une entité de domaine (`this.mapper.toDomain(...)`) avant de la retourner.

### `getAll()`
1.  Utilise `db.select().from(this.table).all()` pour récupérer tous les enregistrements de la table.
2.  Elle mappe ensuite chaque enregistrement de persistance en une entité de domaine.

### `delete(id)`
1.  Utilise `db.delete(this.table).where(eq(this.table.id, id))` pour supprimer l'enregistrement.

### `remove(entity)`
1.  Appelle `this.delete(entity.id)`.
2.  **Publication d'événements :** Publie les événements de domaine de l'agrégat (par exemple, un `PatientDeletedEvent`) après la suppression.

## 4. Gestion des Erreurs

Toutes les méthodes publiques sont encapsulées dans des blocs `try...catch`. En cas d'erreur inattendue (par exemple, une erreur de la base de données), elles lèvent une `RepositoryException` ou une autre exception spécifique, en prenant soin d'encapsuler l'erreur originale. Cela garantit que la couche applicative reçoit des erreurs standardisées et informatives.

## 5. Comment les Repositories Concrets l'utilisent

Grâce à cette classe de base, l'implémentation d'un repository concret devient extrêmement simple :

```typescript
// adapter/patient/infra/repository.expo/PatientRepository.ts

export class PatientRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    Patient,
    PatientPersistenceDto,
    typeof patients // Le schéma de table Drizzle
  >
  implements PatientRepository
{
  // Le constructeur appellera super(...) avec les dépendances nécessaires

  // Implémentation des méthodes spécifiques à PatientRepository
  async exist(id: AggregateID): Promise<boolean> {
    // La logique est déjà dans la classe de base
    return this._exist(id);
  }

  // Les méthodes getAll, save, getById, delete sont héritées directement !
}
```
Ce patron de conception réduit considérablement le code répétitif et garantit que tous les repositories de l'application suivent une approche cohérente et robuste pour la persistance des données et la publication d'événements.
