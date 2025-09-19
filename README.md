# Malnutrix - Alpha Version

**⚠️ Disclaimer: This is an alpha version of Malnutrix. The features and architecture are under active development and are subject to significant changes. ⚠️**

## 🎯 Introduction

Welcome to the new generation of Malnutrix! This project is a complete rewrite of the original application, designed to be more robust, scalable, and maintainable.

Our goal is to progressively migrate the features and architecture of the previous version into this new, improved structure. This README serves as a guide to the target architecture and the roadmap for achieving it.

## 🗺️ Roadmap to V1 - Target Architecture

We are migrating from a previous architecture to a more structured and scalable one. The following represents the target architecture for V1, which will be progressively implemented.

### 📁 `adapter/` - Adapters Layer

This layer will contain all the adapters for external services and frameworks.

*   `adapter/config/` - Configuration for services (auth, notifications).
*   `adapter/db/` - Database schema definitions.
*   `adapter/evaluation/` - Adapters for the evaluation module (infra, mappers).
*   `adapter/medical_record/` - Adapters for the medical record module.
*   `adapter/nutrition_care/` - Adapters for the nutrition care module.
*   `adapter/patient/` - Adapters for the patient module.
*   `adapter/react/` - React-specific adapters and context providers.
*   `adapter/reminders/` - Adapters for the reminders module.
*   `adapter/scripts/` - Data management scripts.
*   `adapter/services/` - Implementations for external services (Auth, Database, Notifications, etc.).
*   `adapter/shared/` - Shared adapter components (repositories, DTOs).
*   `adapter/units/` - Adapters for the units module.

###  core `core/` - Core Business Logic

The heart of the application, containing the domain models, business rules, and use cases.

*   `core/evaluation/` - Evaluation domain logic.
*   `core/medical_record/` - Medical record domain logic.
*   `core/nutrition_care/` - Nutrition care domain logic.
*   `core/patient/` - Patient domain logic.
*   `core/reminders/` - Reminders domain logic.
*   `core/shared/` - Shared core components (domain events, value objects, etc.).
*   `core/units/` - Units domain logic.

### 📱 `app/` - Presentation Layer (Expo Router)

The user interface of the application, built with React Native and Expo Router.

*   `app/(screens)/` - Application screens.
*   `app/home/` - Home screen and related tabs.
*   `app/onboarding/` - Onboarding flow.

### 🧩 `components/` - UI Components

Reusable UI components.

*   `components/custom/` - Custom, application-specific components.
*   `components/pages/` - Components specific to a single page/screen.
geo-samples
*   `components/ui/` - Generic UI components from `gluestack-ui`.

### `src/` - Application Source

*   `src/constants/` - Application constants.
*   `src/context/` - Global application contexts.
*   `src/hooks/` - Reusable hooks.
*   `src/store/` - State management stores (Zustand).

### 🛠️ `utils/` - Utilities

Shared utility functions.

## 🚧 Next Steps

*   Implement the full feature set from the original application.
*   Write comprehensive tests for all modules.
*   Refine and stabilize the API.
*   Improve performance and optimize for different devices.

## 🧭 References

*   [Expo Router Documentation](https://expo.github.io/router/)
*   [React Native](https://reactnative.dev/)
*   [Zustand](https://github.com/pmndrs/zustand)
*   [Drizzle ORM](https://orm.drizzle.team/)
