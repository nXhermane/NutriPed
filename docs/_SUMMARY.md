# Table des Matières

- [Introduction](README.md)

---

## 1. Architecture de Haut Niveau

- [Couche de Présentation (UI)](presentation/PresentationLayer.md)
- [Couche d'Adaptation (Adapter)](adapter/PlatformSpecificImplementation.md)

---

## 2. Fondations du Core (`core/shared`)

### Concepts de Domaine (DDD)

- [ValueObject](core/shared/domain/common/ValueObject.md)
- [Entity](core/shared/domain/common/Entity.md)
- [AggregateRoot](core/shared/domain/common/AggregateRoot.md)
- [Identifier](core/shared/domain/common/Identifier.md)
- [EntityUniqueId](core/shared/domain/common/EntityUniqueId.md)
- [Factory](core/shared/domain/common/Factory.md)
- [GenerateUniqueId](core/shared/domain/common/GenerateUniqueId.md)
- [Objets-Valeur Partagés](core/shared/domain/shared/SharedValueObjects.md)

### Utilitaires Fondamentaux

- [Result & Either](core/shared/core/Result.md)
- [Guard (Clauses de Garde)](core/shared/core/Guard.md)
- [Exceptions & Gestion des Erreurs](core/shared/exceptions/Exceptions.md)
- [Utilitaires Partagés](core/shared/utils/SharedUtilities.md)

### Patrons de Couche Partagés

- **Application**
  - [UseCase](core/shared/application/UseCase.md)
  - [ApplicationMapper](core/shared/application/ApplicationMapper.md)
  - [AppServiceResponse](core/shared/application/AppServiceResponse.md)
  - [CreatePropsDto](core/shared/application/CreatePropsDto.md)
  - [Message](core/shared/application/Message.md)
- **Infrastructure**
  - [Repository (Port)](core/shared/infrastructure/Repository.md)
  - [InfrastructureMapper](core/shared/infrastructure/InfrastructureMapper.md)
  - [Paginated](core/shared/infrastructure/Paginated.md)
  - [Exceptions de Repository](core/shared/infrastructure/RepositoryExceptions.md)
- **Événements**
  - [DomainEvent](core/shared/domain/events/DomainEvent.md)

---

## 3. Implémentations de l'Adapter

- [EntityBaseRepositoryExpo](adapter/shared/repository/expo/EntityBaseRepositoryExpo.md)
- [DatabaseEngine Service](adapter/services/DatabaseEngine.md)
- [PatientRepositoryExpoImpl](adapter/patient/repository/PatientRepositoryExpoImpl.md)

---

## 4. Modules Métier (Core)

### Patient

- **Domain**
  - [Patient (Aggregate)](core/patient/domain/aggregates/Patient.md)
  - [Patient Events](core/patient/domain/events/PatientEvents.md)
  - [PatientRepository (Port)](core/patient/domain/ports/PatientRepository.md)
- **Application**
  - [Patient Use Cases](core/patient/application/PatientUseCases.md)

### Evaluation

- **Domain**
  - [NutritionalDiagnostic (Aggregate)](core/evaluation/domain/aggregates/NutritionalDiagnostic.md)
  - [Evaluation Sub-Domains](core/evaluation/domain/EvaluationSubDomains.md)
- **Application**
  - [Evaluation Use Cases](core/evaluation/application/EvaluationUseCases.md)

### Nutrition Care

- **Domain**
  - [PatientCareSession (Aggregate)](core/nutrition_care/domain/aggregates/PatientCareSession.md)
  - [NutritionCare Sub-Modules](core/nutrition_care/domain/NutritionCareSubModules.md)
- **Application**
  - [NutritionCare Use Cases](core/nutrition_care/application/NutritionCareUseCases.md)

### Medical Record

- **Domain**
  - [MedicalRecord (Aggregate)](core/medical_record/domain/aggregates/MedicalRecord.md)
- **Application**
  - [MedicalRecord Use Cases](core/medical_record/application/MedicalRecordUseCases.md)

### Reminders

- **Domain**
  - [Reminder Domain](core/reminders/domain/ReminderDomain.md)
- **Application**
  - [Reminder Use Cases](core/reminders/application/ReminderUseCases.md)

### Units

- **Domain**
  - [Units Domain](core/units/domain/UnitsDomain.md)
- **Application**
  - [Units Use Cases](core/units/application/UnitsUseCases.md)
