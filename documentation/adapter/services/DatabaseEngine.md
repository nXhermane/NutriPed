# DatabaseEngine Service

**Dossier Source:** `adapter/services/DatabaseEngine/`

## 1. Vue d'Ensemble

Le `DatabaseEngine` est un service d'infrastructure fondamental dont la seule responsabilité est de **gérer le cycle de vie de la base de données** de l'application.

Il abstrait complètement les détails de l'initialisation, de la migration et de l'accès à la base de données. Le reste de l'application (principalement les `Repositories`) interagit avec la base de données via ce service, sans avoir à connaître la technologie sous-jacente (SQLite, IndexedDB, etc.).

## 2. Le Contrat : `IDatabaseEngine`

L'interface `IDatabaseEngine` définit les capacités du service.

**Fichier Source:** `IDatabaseEngine.ts`
```typescript
export interface DatabaseEngine {
  init(): Promise<void>;
  getDb(): unknown;
  open(): Promise<void>;
  close(): Promise<void>;
  delete(): Promise<void>;
}
```
- **`init()`**: La méthode la plus importante. Elle initialise la base de données, s'assure que le schéma est à jour en appliquant les migrations, et prépare la connexion.
- **`getDb()`**: Retourne l'objet de connexion à la base de données brute, spécifique à la plateforme. Cet objet est ensuite utilisé par les repositories.
- **`open()`, `close()`, `delete()`**: Des méthodes pour gérer le cycle de vie de la connexion, bien qu'elles ne soient pas toujours nécessaires selon la technologie de base de données utilisée.

## 3. L'Implémentation Native : `NativeDatabaseEngine`

Cette classe est l'implémentation du contrat pour la plateforme Expo/native.

**Fichier Source:** `engine.native.ts`
```typescript
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseAsync, SQLiteDatabase } from "expo-sqlite";

export default class NativeDatabaseEngine implements DatabaseEngine {
  private expoDb: SQLiteDatabase | null = null;

  async init(): Promise<void> {
    // 1. Ouvre la connexion à la base de données SQLite
    this.expoDb = await openDatabaseAsync("nutrition_app.db");

    // 2. Crée une instance de l'ORM Drizzle
    const db = drizzle(this.expoDb);

    // 3. Applique automatiquement les migrations de schéma
    await migrate(db, migrations);
  }

  getDb() {
    return this.expoDb;
  }
  // ...
}
```

### 3.1. Processus d'Initialisation (`init`)

La méthode `init` est au cœur du service. Elle effectue trois actions critiques au démarrage de l'application :
1.  **Ouvrir la Base de Données :** Elle utilise `openDatabaseAsync` de la bibliothèque `expo-sqlite` pour ouvrir (ou créer si elle n'existe pas) le fichier de base de données local nommé `nutrition_app.db`.
2.  **Initialiser l'ORM Drizzle :** Elle passe l'objet de connexion `expo-sqlite` à `drizzle` pour obtenir une instance de l'ORM, qui permettra d'effectuer des requêtes de manière typée et sécurisée.
3.  **Appliquer les Migrations :** Elle utilise la fonction `migrate` de `drizzle-orm/expo-sqlite/migrator`. Cette fonction compare l'état actuel de la base de données avec les fichiers de migration SQL situés dans le dossier `drizzle/migrations` et applique automatiquement toutes les migrations nécessaires pour mettre à jour le schéma. C'est un mécanisme robuste et essentiel pour faire évoluer la base de données au fil des versions de l'application.

### 3.2. Fournir la Connexion (`getDb`)

La méthode `getDb` retourne l'objet de connexion brut `expoDb`. Cet objet est ensuite injecté dans le constructeur des repositories (comme [EntityBaseRepositoryExpo](../shared/repository/expo/EntityBaseRepositoryExpo.md)) pour qu'ils puissent exécuter leurs requêtes.
