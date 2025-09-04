# Lexicon of Nutriped

This document provides a glossary of important domain-specific and technical terms used throughout the Nutriped project. It is intended to help developers, contributors, and other stakeholders understand the core concepts of the application.

## Domain-Specific Terms (Pediatrics & Nutrition)

These terms relate to the medical field of pediatric nutrition and are central to the application's purpose.

---

### **Anthropometry**


- **Simple Explanation:** The measurement of the human body's physical size and proportions. In this app, it refers to things like a child's height, weight, and head circumference.
- **Technical Context:** Refers to the `AnthropometricData` domain model and related use cases. It's one of the three main pillars of patient evaluation, alongside clinical and biological data. Measurements are often used to calculate growth indicators.


---

### **Growth Indicator**


- **Simple Explanation:** A calculated value that compares a child's measurement to a standard reference population. Examples include "Weight-for-Age" or "Height-for-Age".
- **Technical Context:** These are calculated by services like `CalculateGrowthIndicatorValueUseCase`. They are crucial for determining if a child's growth is on track. The result is often expressed as a Z-Score.


---

### **Z-Score**


- **Simple Explanation:** A statistical measure that tells you how far away from the average a data point is. In pediatrics, it shows if a child's measurement (like weight or height) is above or below the average for their age and sex. A Z-score of 0 is average.
- **Technical Context:** Z-scores are the primary output of growth indicator calculations. They are used in `NutritionalAssessmentService` to classify the patient's nutritional status (e.g., stunted, wasted, overweight).


---

### **Clinical Signs**


- **Simple Explanation:** Physical symptoms or signs observed by a healthcare professional that can indicate a nutritional issue (e.g., edema, skin changes).
- **Technical Context:** Represented by the `ClinicalData` domain model. This is qualitative data that feeds into the overall `NutritionalAssessmentService` to provide a more holistic diagnostic.


---

### **Biological Data**


- **Simple Explanation:** Results from laboratory tests, such as blood tests (e.g., hemoglobin levels, albumin).
- **Technical Context:** Represented by the `BiologicalTestResult` value object. This quantitative data provides another layer of information for the nutritional assessment.


---

### **Nutritional Assessment**

- **Simple Explanation:** The overall process of evaluating a child's nutritional health.
- **Technical Context:** This is the core function of the application, encapsulated in the `nutritionalAssessmentService`. It orchestrates the analysis of anthropometric, clinical, and biological data to produce a `NutritionalDiagnostic`.


## Architectural & Technical Terms

These terms relate to the software architecture and design patterns used in the codebase.

---

### **Domain-Driven Design (DDD)**


- **Simple Explanation:** An approach to software development that focuses on modeling the software to match the real-world domain it's meant for.
- **Technical Context:** The entire project is structured around DDD principles. The `core` directory represents the Domain and Application layers, while the `adapter` directory contains Infrastructure-layer components.


---

### **Aggregate / AggregateRoot**


- **Simple Explanation:** A cluster of related objects that are treated as a single unit. For example, the `Patient` aggregate includes the patient's name, address, and contact info.
- **Technical Context:** `AggregateRoot` is a base class for main domain entities like `Patient` and `NutritionalDiagnostic`. It ensures that the business rules (invariants) for the entire aggregate are enforced with every change.


---

### **Value Object**

- **Simple Explanation:** An object that represents a descriptive aspect of the domain with no conceptual identity. For example, `FullName` or `Birthday`. You care about _what_ they are, not _who_ they are.
- **Technical Context:** Used extensively in the domain models (e.g., `Gender`, `Address`, `Contact`). They are immutable and validated upon creation, ensuring data integrity.


---

### **Domain Event**


- **Simple Explanation:** Something that happened in the past that is important to the business. For example, "a patient was created" or "a diagnostic was generated".
- **Technical Context:** The system uses events like `PatientCreatedEvent` to communicate between different parts of the application without coupling them directly. This is managed by the `domain-eventrix` library.


---

### **Use Case (or Interactor)**

- **Simple Explanation:** A specific action that a user can perform, like "evaluate a patient" or "create a patient".
- **Technical Context:** Implemented as classes in the `application/useCases` directory (e.g., `GenerateDiagnosticResultUseCase`). They orchestrate the flow of data, calling on domain entities and services to perform the business logic.


---

### **Repository**


- **Simple Explanation:** A component that handles the storage and retrieval of data, hiding the details of the database.
- **Technical Context:** The `adapter` directory defines repository interfaces (e.g., `NutritionalDiagnosticRepository`) and their implementations for different platforms (`.expo` for mobile, `.web` for web), using Drizzle ORM.


---

### **Anti-Corruption Layer (ACL)**


- **Simple Explanation:** A layer of code that translates data between different parts of a system that might use different models or languages.
- **Technical Context:** The project uses ACLs (e.g., `PatientACL`, `MedicalRecordACL`) to allow the `Evaluation` context to safely access data from the `Patient` and `MedicalRecord` contexts without being tightly coupled to their internal implementations.


---

### **Dependency Injection (DI)**


- **Simple Explanation:** A design pattern where a component is given its dependencies (the other objects it needs to work with) instead of creating them itself.
- **Technical Context:** The `tsyringe` library is used as a DI container. It wires up the application, for example, by injecting a repository implementation into a use case that needs it.

