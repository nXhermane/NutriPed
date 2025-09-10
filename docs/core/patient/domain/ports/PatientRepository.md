# PatientRepository (Port)

**Fichier Source:** `core/patient/domain/ports/secondary/PatientRepository.ts`

## 1. Vue d'Ensemble

L'interface `PatientRepository` définit le **contrat** (le "Port" en architecture hexagonale) pour la persistance des agrégats [Patient](../aggregates/Patient.md). Elle décrit toutes les opérations de lecture et d'écriture que la couche applicative peut effectuer sur les entités `Patient`, sans spécifier _comment_ ces opérations sont réalisées.

Le fait de définir cette interface dans le domaine permet de respecter le **Principe d'Inversion des Dépendances** : le domaine ne dépend pas de l'infrastructure ; c'est l'infrastructure qui dépendra de cette interface définie par le domaine.

## 2. Définition de l'Interface

```typescript
import { AggregateID, Repository } from "@shared";
import { Patient } from "../../models";

export interface PatientRepository extends Repository<Patient> {
  getAll(): Promise<Patient[]>;
  exist(id: AggregateID): Promise<boolean>;
  remove(patient: Patient): Promise<void>;
}
```

### 2.1. Héritage de `Repository<Patient>`

L'interface `PatientRepository` étend l'interface de base [Repository](../../../shared/infrastructure/Repository.md), typée avec l'agrégat `Patient`. Elle hérite donc des méthodes standard suivantes :

- **`getById(id: AggregateID): Promise<Patient>`**
  - Récupère un patient par son ID.

- **`save(entity: Patient): Promise<void>`**
  - Sauvegarde un patient (création ou mise à jour).

- **`delete(id: AggregateID): Promise<void>`**
  - Supprime un patient par son ID.

### 2.2. Méthodes Spécifiques

En plus des méthodes de base, elle définit des opérations propres à la gestion des patients :

- **`getAll(): Promise<Patient[]>`**
  - **Objectif :** Récupérer la liste de tous les patients enregistrés.
  - **Utilisation :** Typiquement pour afficher la liste complète des patients dans l'interface utilisateur.

- **`exist(id: AggregateID): Promise<boolean>`**
  - **Objectif :** Vérifier rapidement si un patient avec un ID donné existe.
  - **Utilisation :** C'est une méthode optimisée. Plutôt que de charger l'entité complète avec `getById` juste pour voir si elle existe, cette méthode effectue une requête plus légère (comme un `SELECT COUNT(*)`).

- **`remove(patient: Patient): Promise<void>`**
  - **Objectif :** Une méthode alternative pour supprimer un patient, en passant l'instance complète de l'entité.
  - **Utilisation :** Peut être utile si une logique de pré-suppression nécessite l'état complet de l'entité, ou pour des raisons de cohérence dans certaines transactions.

## 3. Implémentation

Cette interface est le "quoi". Le "comment" est défini dans la couche `adapter`, où des classes concrètes implémenteront cette interface pour une technologie de base de données spécifique (par exemple, `PatientRepositoryExpo` pour SQLite sur mobile, et `PatientRepositoryWeb` pour IndexedDB sur le web).
