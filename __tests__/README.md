# NutriPed Testing Documentation

This directory contains tests for the NutriPed application, organized to mirror the structure of the main codebase.

## Testing Approach

The testing strategy follows these principles:

1. **Domain-Driven Testing**: Tests are organized according to the DDD structure of the application.
2. **Unit Tests**: Focus on testing individual domain entities, value objects, and services in isolation.
3. **Test Structure**: Tests follow the Arrange-Act-Assert (AAA) pattern for clarity.

## Directory Structure

The test directory structure mirrors the main codebase:

```
__tests__/
├── core/
│   ├── units/
│   │   ├── domain/
│   │   │   ├── models/
│   │   │   │   ├── aggregates/
│   │   │   │   │   └── Unit.test.ts
│   │   │   ├── events/
│   │   │   └── services/
│   │   └── application/
│   └── shared/
└── adapter/
```

## Running Tests

To run the tests, use the following command:

```bash
npm test
```

To run tests with coverage:

```bash
npm test -- --coverage
```

## Writing Tests

When writing tests, follow these guidelines:

1. **Test File Naming**: Name test files with the `.test.ts` or `.spec.ts` suffix.
2. **Test Organization**: Use `describe` blocks to group related tests.
3. **Test Cases**: Use `it` or `test` for individual test cases with clear descriptions.
4. **Assertions**: Use Jest's expect API for assertions.
5. **Mocking**: Use Jest's mocking capabilities for dependencies.

## Example Test Structure

```typescript
describe('Entity Name', () => {
  describe('Method Name', () => {
    it('should do something when condition', () => {
      // Arrange
      // ...setup test data
      
      // Act
      // ...call the method being tested
      
      // Assert
      // ...verify the expected outcome
    });
  });
});
```

