# Contributing to Nutriped

First off, thank you for considering contributing to Nutriped! Your help is essential for making this tool better for everyone.

This document provides guidelines for contributing to the project. Please read it carefully to ensure a smooth and effective collaboration process.

## Code of Conduct

This project and everyone participating in it is governed by a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior. (Note: A `CODE_OF_CONDUCT.md` should be added, but for now, this serves as a placeholder).

## How Can I Contribute?

There are many ways to contribute, from writing code and documentation to reporting bugs and suggesting new features.

*   **Reporting Bugs:** If you find a bug, please create an issue in our issue tracker, describing the bug, how to reproduce it, and the expected behavior.
*   **Suggesting Enhancements:** If you have an idea for a new feature or an improvement to an existing one, please create an issue to discuss it.
*   **Writing Code:** If you want to contribute code, please follow the process outlined below.

## Development Process

### Branching Strategy

We follow a GitFlow-like branching model. Please create a new branch for every feature or bugfix you work on. The branch name should be descriptive and follow this convention:

*   `feature/<feature-name>` for new features (e.g., `feature/add-pdf-export`).
*   `bugfix/<issue-number>-<description>` for bug fixes (e.g., `bugfix/123-fix-login-crash`).
*   `docs/<topic>` for documentation changes (e.g., `docs/update-readme`).

Do not commit directly to the `main` branch.

### Commit Messages

We use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification for our commit messages. This helps us automate changelogs and makes the commit history easier to read.

Each commit message should consist of a **header**, a **body**, and a **footer**. The header has a special format that includes a **type**, a **scope**, and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

**Example:**

```
feat(evaluation): add support for MUAC z-score calculation

This commit introduces a new service to calculate the z-score for the Mid-Upper Arm Circumference (MUAC) based on WHO standards.

Fixes #245
```

Common types include: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`.

### Code Style

We use **Prettier** for code formatting and **ESLint** for code analysis. Please ensure your code adheres to the project's style guidelines.

You can format your code automatically by running:

```bash
npm run format
```

Before committing, it's a good practice to run the linter to catch any issues:

```bash
npm run lint
```

### Testing

While the project is still growing its test suite, we encourage contributors to add unit or integration tests for any new functionality they introduce. Tests help us prevent regressions and ensure the reliability of the application.

### Pull Request Process

1.  **Fork the repository** and create your branch from `main`.
2.  **Make your changes** in your branch.
3.  **Ensure your code lints** and passes any existing tests.
4.  **Update the documentation** (`README.md`, `LEXICAL.md`, etc.) if your changes affect it.
5.  **Create a Pull Request (PR)** to the `main` branch of the original repository.
6.  **Provide a clear description** of your changes in the PR, explaining the "what" and "why" of your contribution.
7.  **Wait for a code review.** One of the project maintainers will review your code, and may ask for changes. Please be responsive to feedback.

## ⚠️ A Note on Data Sensitivity

This application is designed to handle sensitive medical data. When contributing, please be mindful of the following:

*   **Do not commit any real patient data.** Use only anonymized or synthetic data for testing and development.
*   **Consider security and privacy** in all your changes. Ensure that data handling practices are secure and protect user privacy.
*   **Adhere to ethical guidelines** regarding the treatment of medical information.

Thank you again for your interest in contributing to Nutriped!
