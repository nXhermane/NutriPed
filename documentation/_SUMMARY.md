# Table des Matières

* [Introduction](README.md)

---

## Core (Logique Métier)

### Shared (Partagé)

* **Domain (Domaine)**
    * [ValueObject](core/shared/domain/common/ValueObject.md)
    * [Entity](core/shared/domain/common/Entity.md)
    * [AggregateRoot](core/shared/domain/common/AggregateRoot.md)
    * [Identifier](core/shared/domain/common/Identifier.md)
    * [EntityUniqueId](core/shared/domain/common/EntityUniqueId.md)
    * [Factory](core/shared/domain/common/Factory.md)
    * [GenerateUniqueId](core/shared/domain/common/GenerateUniqueId.md)

* **Core Utilities (Utilitaires Fondamentaux)**
    * [Result & Either](core/shared/core/Result.md)
    * [Guard](core/shared/core/Guard.md)
    * [Exceptions & Error Handling](core/shared/exceptions/Exceptions.md)

* **Application Layer (Couche Applicative)**
    * [UseCase](core/shared/application/UseCase.md)
    * [ApplicationMapper](core/shared/application/ApplicationMapper.md)
    * [AppServiceResponse](core/shared/application/AppServiceResponse.md)
    * [CreatePropsDto](core/shared/application/CreatePropsDto.md)
    * [Message](core/shared/application/Message.md)

* **Infrastructure Layer (Couche d'Infrastructure)**
    * [Repository](core/shared/infrastructure/Repository.md)
    * [InfrastructureMapper](core/shared/infrastructure/InfrastructureMapper.md)
    * [Paginated](core/shared/infrastructure/Paginated.md)
    * [Repository Exceptions](core/shared/infrastructure/RepositoryExceptions.md)

* **Utilities (Utilitaires)**
    * [Shared Utilities](core/shared/utils/SharedUtilities.md)

* **Events (Événements)**
    * [DomainEvent](core/shared/domain/events/DomainEvent.md)

* **Shared Value Objects (Objets-Valeur Partagés)**
    * [SharedValueObjects](core/shared/domain/shared/SharedValueObjects.md)

---
## Adapter Layer (Couche d'Adaptation)

### Shared (Partagé)
* [EntityBaseRepositoryExpo](adapter/shared/repository/expo/EntityBaseRepositoryExpo.md)
* [DatabaseEngine Service](adapter/services/DatabaseEngine.md)
* [Platform-Specific Implementations](adapter/PlatformSpecificImplementation.md)

### Patient
* [PatientRepositoryExpoImpl](adapter/patient/repository/PatientRepositoryExpoImpl.md)

---
## Presentation Layer (Couche de Présentation)
* [Presentation Layer Overview](presentation/PresentationLayer.md)

---
## Modules Métier

### Patient
* **Domain**
    * [Patient (Aggregate)](core/patient/domain/aggregates/Patient.md)
    * [Patient Events](core/patient/domain/events/PatientEvents.md)
    * [PatientRepository (Port)](core/patient/domain/ports/PatientRepository.md)
* **Application**
    * [Patient Use Cases](core/patient/application/PatientUseCases.md)

### Evaluation
* **Domain**
    * [NutritionalDiagnostic (Aggregate)](core/evaluation/domain/aggregates/NutritionalDiagnostic.md)
    * [Evaluation Sub-Domains](core/evaluation/domain/EvaluationSubDomains.md)
* **Application**
    * [Evaluation Use Cases](core/evaluation/application/EvaluationUseCases.md)
