# Tests Unitaires pour NutriPed

Ce répertoire contient les tests unitaires pour le core de l'application NutriPed, organisés selon les principes du Domain-Driven Design (DDD) et de la Clean Architecture.

## Structure des Tests

La structure des tests suit la structure du code source, avec une organisation par bounded context et par couche (domain, application).

```
tests/
├── core/
│   ├── shared/                  # Tests pour les composants partagés
│   │   ├── core/                # Tests pour les utilitaires de base (Result, Guard, etc.)
│   │   └── domain/              # Tests pour les composants de domaine partagés
│   │       ├── common/          # Tests pour les classes de base (Entity, ValueObject, etc.)
│   │       └── shared/          # Tests pour les value objects partagés
│   ├── evaluation/              # Tests pour le bounded context Evaluation
│   │   ├── domain/              # Tests pour la couche domain
│   │   └── application/         # Tests pour la couche application
│   ├── medical_record/          # Tests pour le bounded context Medical Record
│   ├── nutrition_care/          # Tests pour le bounded context Nutrition Care
│   ├── patient/                 # Tests pour le bounded context Patient
│   ├── reminders/               # Tests pour le bounded context Reminders
│   └── units/                   # Tests pour le bounded context Units
└── utils/                       # Utilitaires pour les tests
    ├── TestBuilders.ts          # Builders pour créer des objets de test
    └── MockFactory.ts           # Factory pour créer des mocks
```

## Conventions de Nommage

- Les fichiers de test sont nommés avec le suffixe `.test.ts` ou `.spec.ts`.
- Les tests pour une classe `X.ts` sont nommés `X.test.ts`.
- Les tests sont organisés en groupes avec `describe` et en cas de test avec `it`.

## Exécution des Tests

Pour exécuter tous les tests :

```bash
yarn test
```

Pour exécuter les tests avec couverture de code :

```bash
yarn test:coverage
```

Pour exécuter les tests d'un fichier spécifique :

```bash
yarn test -- -t "nom du test"
```

## Utilitaires de Test

### TestBuilders

Les builders permettent de créer facilement des objets de test avec des valeurs par défaut qui peuvent être personnalisées.

Exemple :

```typescript
const domainDate = new DateBuilder().withDate("2023-01-01").build();
```

### MockFactory

La factory de mocks permet de créer facilement des mocks pour les repositories, services et cas d'utilisation.

Exemple :

```typescript
const mockRepository = MockFactory.createRepositoryMock({
  findById: jest.fn().mockResolvedValue(someEntity),
});
```

## Bonnes Pratiques

1. **Isolation** : Chaque test doit être isolé et ne pas dépendre d'autres tests.
2. **Mocks** : Utiliser des mocks pour les dépendances externes.
3. **Arrange-Act-Assert** : Structurer les tests en trois phases : préparation, action, vérification.
4. **Tests Lisibles** : Les tests doivent être faciles à comprendre et à maintenir.
5. **Couverture** : Viser une couverture de code élevée, en particulier pour la logique métier.

## Matchers Personnalisés

Des matchers personnalisés ont été ajoutés pour faciliter les assertions sur les objets Result et Either :

- `toBeSuccessResult` : Vérifie qu'un Result est un succès.
- `toBeFailureResult` : Vérifie qu'un Result est un échec.
- `toBeRight` : Vérifie qu'un Either est un Right.
- `toBeLeft` : Vérifie qu'un Either est un Left.

Exemple :

```typescript
expect(result).toBeSuccessResult();
expect(either).toBeRight();
```
