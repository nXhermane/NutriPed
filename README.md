# Nutriped - Pediatric Nutritional Assessment Tool

Nutriped is a comprehensive, cross-platform mobile application designed for healthcare professionals to manage and evaluate the nutritional status of pediatric patients. It provides a robust set of tools for data collection, analysis, and diagnostics, based on established medical standards.

## 🎯 Purpose and Context

In pediatrics, accurately assessing a child's growth and nutritional health is crucial. Nutriped aims to simplify and standardize this process by providing a digital solution that is both powerful and easy to use. The application is intended for use by pediatricians, nutritionists, and other healthcare providers in clinical settings.

It allows for the detailed tracking of a patient's anthropometric, clinical, and biological data, and uses this information to generate automated nutritional diagnostics, helping professionals make informed decisions quickly.

## ✨ Main Features

*   **Patient Management:** Securely create, store, and manage patient records, including demographic information, parental details, and contact information.
*   **Comprehensive Data Collection:**
    *   **Anthropometry:** Record measurements like weight, height, head circumference, and MUAC (Mid-Upper Arm Circumference).
    *   **Clinical Signs:** Document observed clinical signs relevant to nutritional status.
    *   **Biological Data:** Input results from biological tests.
*   **Advanced Nutritional Assessment:**
    *   The core of the application is a powerful engine that evaluates the collected data against standard growth references (e.g., WHO standards).
    *   It calculates key growth indicators and Z-scores (e.g., Weight-for-Age, Height-for-Age, Weight-for-Height).
*   **Automated Diagnostics:** Generates a complete nutritional diagnostic report based on a holistic assessment of all available data.
*   **Growth Charts & Tools:** Visualize patient growth over time using interactive charts and access various pediatric calculation tools.
*   **Data Portability:** Features capabilities for importing and exporting data, potentially through formats like XLSX and ZIP, for interoperability with other systems.

## 💻 Technology Stack

Nutriped is built with a modern and scalable technology stack, centered around a Domain-Driven Design (DDD) architecture.

*   **Core Framework:** React Native (with Expo)
*   **Language:** TypeScript
*   **Architecture:**
    *   **Domain-Driven Design (DDD):** A clear separation of concerns with `core` (domain logic), `adapter` (infrastructure), and `app` (presentation) layers.
    *   **Dependency Injection:** Uses `tsyringe` for managing dependencies and decoupling modules.
    *   **Event-Driven:** Employs domain events for handling side effects in a clean way.
*   **UI:**
    *   [Gluestack UI](https://gluestack.io/ui) for a consistent and accessible component library.
    *   [NativeWind](https://www.nativewind.dev/) using Tailwind CSS for utility-first styling.
*   **State Management:** Redux Toolkit
*   **Navigation:** Expo Router (file-system based routing)
*   **Database:** Drizzle ORM with Expo-SQLite for the local database.
*   **Data Validation:** Zod for schema definition and validation.

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS version recommended)
*   npm or yarn
*   Expo CLI
*   An Android or iOS emulator/device for running the application.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nutriped
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

### Running the Application

You can run the application on different platforms using the following scripts:

*   **To start the development server:**
    ```bash
    npm start
    ```
    This will open the Expo developer tools in your browser. You can then scan the QR code with the Expo Go app on your mobile device or run it on a simulator.

*   **To run directly on Android:**
    ```bash
    npm run android
    ```

*   **To run directly on iOS:**
    ```bash
    npm run ios
    ```

*   **To run on the web:**
    ```bash
    npm run web
    ```

## Usage Example

1.  **Launch the application** and navigate to the patients screen.
2.  **Create a new patient** by entering their demographic details (name, birthday, gender, etc.).
3.  **Select the patient** to view their medical record.
4.  **Add new data** by creating an evaluation entry:
    *   Enter anthropometric measurements.
    *   Document any relevant clinical signs.
    *   Input biological test results if available.
5.  **Generate the Diagnostic:** Trigger the nutritional assessment. The application will process the data and present a detailed diagnostic report, including Z-scores and classifications.
