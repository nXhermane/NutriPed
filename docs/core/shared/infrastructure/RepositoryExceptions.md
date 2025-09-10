# Repository Exceptions

**Fichier Source:** `core/shared/infrastructure/RepositoryNotFoundError.ts`

Ce fichier définit des classes d'[Exception](../exceptions/Exceptions.md) personnalisées qui sont spécifiques aux opérations effectuées par les [Repositories](./Repository.md). L'utilisation de ces exceptions spécifiques permet de rendre le code qui interagit avec les repositories plus explicite et plus robuste.

## 1. `RepositoryNotFoundException`

Cette exception est levée lorsqu'une opération de lecture (typiquement `getById`) ne parvient pas à trouver la ressource demandée.

```typescript
export class RepositoryNotFoundException extends ExceptionBase {
  code: string = NOT_FOUND;
}
```

- **Hérite de :** `ExceptionBase`
- **Code d'erreur :** `NOT_FOUND`

C'est une pratique courante et recommandée de lever une exception dans ce cas, plutôt que de retourner `null` ou `undefined`. Cela force l'appelant (généralement un [UseCase](../application/UseCase.md)) à gérer explicitement le cas où l'entité n'existe pas, ce qui évite des erreurs de type "cannot read property of null" plus loin dans le code.

### Exemple d'utilisation dans un Repository

```typescript
// Dans l'implémentation d'un Repository
public async getById(id: AggregateID): Promise<Patient> {
  const rawPatient = await this.db.query('SELECT * FROM patients WHERE id = ?', [id]);

  if (!rawPatient) {
    // Si aucune ligne n'est retournée, on lève l'exception spécifique.
    throw new RepositoryNotFoundException(`Patient with ID ${id} not found.`);
  }

  return this.mapper.toDomain(rawPatient);
}
```

## 2. `RepositoryInternalError`

Cette exception est utilisée pour signaler une erreur inattendue qui se produit à l'intérieur de la logique du repository et qui n'est pas liée à une ressource non trouvée.

```typescript
export class RepositoryInternalError extends ExceptionBase {
  code: string = INTERNAL_REPO_ERROR;
}
```

- **Hérite de :** `ExceptionBase`
- **Code d'erreur :** `INTERNAL_REPO_ERROR`

**Cas d'utilisation typiques :**

- Un problème de connexion à la base de données.
- Une requête SQL malformée.
- Un échec lors de la transaction de sauvegarde.
- Toute autre erreur imprévue provenant du driver de la base de données ou d'une API externe.

### Exemple d'utilisation dans un Repository

```typescript
public async save(entity: Patient): Promise<void> {
  const dto = this.mapper.toPersistence(entity);
  try {
    // On essaie d'exécuter la requête d'insertion/mise à jour
    await this.db.execute('...', [dto]);
  } catch (dbError) {
    // Si une erreur de base de données se produit, on l'encapsule
    // dans une RepositoryInternalError.
    throw new RepositoryInternalError(
      'Failed to save patient',
      dbError as Error // On passe l'erreur originale dans `cause`
    );
  }
}
```

Encapsuler l'erreur originale dans `cause` est une bonne pratique car cela préserve la pile d'appels et le contexte de l'erreur initiale, ce qui est très utile pour le débogage.
