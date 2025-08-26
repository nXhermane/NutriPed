# Nutriped Internal Project Rules

This document outlines the internal rules, conventions, and best practices for the Nutriped project. Adhering to these rules ensures consistency, maintainability, and quality across the codebase.

## 1. Code Style and Quality

Consistency in code style is crucial for readability and collaboration.

*   **Formatting:** All code must be formatted with **Prettier**. Use the provided configuration (`.prettierrc`). You can format the entire project by running:
    ```bash
    npm run format
    ```
*   **Linting:** Code quality is enforced by **ESLint**. All code should be free of linting errors before being committed. Run the linter with:
    ```bash
    npm run lint
    ```
*   **TypeScript:** Follow TypeScript best practices. Use strong types and avoid using `any` whenever possible. Leverage `zod` for runtime validation of data structures, especially for inputs and API boundaries.

## 2. Project Structure and Architecture

The project follows a strict Domain-Driven Design (DDD) architecture. It's essential to understand and respect the separation of concerns between the layers.

*   **`core/` Directory:** This is the heart of the application.
    *   **`core/.../domain/`:** Contains the business logic, including Aggregates, Value Objects, Domain Events, and Domain Services. This layer should have **zero dependencies** on any specific framework or infrastructure (like databases or UI libraries).
    *   **`core/.../application/`:** Contains the Use Cases (Interactors) that orchestrate the domain logic. It depends on the domain layer but should remain independent of infrastructure.

*   **`adapter/` Directory:** This is the infrastructure layer.
    *   It **adapts** external technologies to the needs of the `core` application.
    *   Contains implementations of repositories (e.g., for Drizzle ORM), external service clients, and other framework-specific code.
    *   This is where the application connects to the outside world.

*   **`app/` Directory:** This is the presentation layer (UI).
    *   Built with React Native and Expo Router.
    *   It should only contain UI-related logic (components, screens, navigation).
    *   It interacts with the application layer via hooks that call the Use Cases.

*   **`src/` Directory:** This directory contains application-level utilities, shared hooks, contexts, and constants that are specific to the client-side implementation.

**Golden Rule:** The dependency flow is always one-way: **`app` -> `src` -> `adapter` -> `core`**. A layer should never depend on a layer above it. For example, `core` must never import from `adapter` or `app`.

## 3. Data Handling and Security

Given the medical nature of this application, data must be handled with the utmost care.

*   **Data Validation:** All external data (user input, API responses) must be validated before entering the system. Use **Zod** schemas for this purpose, typically at the boundary of the application layer (in Use Cases or DTOs).
*   **Confidentiality:** No real patient data should ever be committed to the repository. Use fake, anonymized data for development and testing (e.g., `MokedPatientList.ts`).
*   **Error Handling:** Use the `Result` class for operations that can fail. Avoid throwing exceptions for predictable errors (e.g., validation failures, items not found). Exceptions should be reserved for truly unexpected, system-level problems.

## 4. Documentation

Maintaining up-to-date documentation is as important as writing code.

*   **README.md:** Should always reflect the current state of the project, including setup instructions and a high-level overview.
*   **LEXICAL.md:** If you introduce a new, important domain or technical concept, add it to the lexicon.
*   **Code Comments:** Write comments for complex logic, but prefer self-documenting code (clear variable and function names).
*   **Architectural Decisions:** Significant architectural changes should be documented, potentially in the `docs/adr` (Architecture Decision Records) directory.

By following these rules, we can build a high-quality, robust, and maintainable application that is safe and effective for its users.
