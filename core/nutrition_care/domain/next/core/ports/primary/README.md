# Ports Primaires - Orchestration des Soins Patients

## 📋 Vue d'ensemble

Les **ports primaires** font partie de l'architecture hexagonale et définissent l'interface que les **use cases** (couche application) utilisent pour interagir avec le **domaine**.

Le `IPatientCareOrchestrationPort` est le port primaire principal pour l'orchestration des soins patients.

## 🏗️ Architecture

### **Structure des Ports**

```
core/nutrition_care/application/
├── ports/
│   └── primary/
│       ├── IPatientCareOrchestrationPort.ts    # Interface du port
│       └── README.md                           # Documentation
└── services/
    ├── PatientCareOrchestrationPort.ts         # Implémentation
    └── PatientCareOrchestrationPortExample.ts  # Exemples d'usage
```

### **Responsabilités du Port Primaire**

- ✅ **Définir le contrat** : Interface claire pour les use cases
- ✅ **Adapter les appels** : Transformation des données entre couches
- ✅ **Gérer les erreurs** : Conversion des erreurs domaine vers application
- ✅ **Maintenir la séparation** : Couche application ≠ couche domaine

## 🔧 Interface du Port

### **Méthodes Principales**

```typescript
interface IPatientCareOrchestrationPort {
  // Initialisation de session
  initializePatientCareSession(
    patientId: AggregateID,
    phaseCode?: string,
    patientVariables?: Record<string, number>
  ): Promise<Result<PatientCareSession>>;

  // Orchestration automatique
  orchestratePatientCareWorkflow(
    session: PatientCareSession,
    patientVariables?: Record<string, number>,
    maxIterations?: number
  ): Promise<Result<OrchestratorResult>>;

  // Exécution d'opération spécifique
  executeOrchestrationOperation(
    session: PatientCareSession,
    operation: OrchestratorOperation,
    context?: OrchestrationContext
  ): Promise<Result<OrchestratorResult>>;

  // Synchronisation d'état
  synchronizePatientCareState(
    session: PatientCareSession,
    patientVariables?: Record<string, number>
  ): Promise<Result<OrchestratorResult>>;

  // Gestion des réponses utilisateur
  handleUserResponse(
    session: PatientCareSession,
    messageId: AggregateID,
    response: string,
    decisionData?: Record<string, any>
  ): Promise<Result<OrchestratorResult>>;

  // Consultation des messages
  getPendingMessages(session: PatientCareSession): Promise<Result<Message[]>>;
  hasPendingMessages(session: PatientCareSession): Promise<Result<boolean>>;

  // Statut de session
  getPatientCareSessionStatus(
    session: PatientCareSession
  ): Promise<Result<SessionStatus>>;
}
```

## 🚀 Utilisation dans les Use Cases

### **1. Injection de Dépendances**

```typescript
export class InitializePatientCareUseCase {
  constructor(
    private readonly orchestrationPort: IPatientCareOrchestrationPort
  ) {}
  // ...
}
```

### **2. Utilisation Simple**

```typescript
async execute(patientId: AggregateID) {
  const result = await this.orchestrationPort.initializePatientCareSession(
    patientId,
    "INITIAL_ASSESSMENT",
    { weight: 65, height: 170, age: 2 }
  );

  if (result.isFailure) {
    throw new Error("Échec initialisation");
  }

  return result.val;
}
```

### **3. Orchestration Complète**

```typescript
async execute(session: PatientCareSession) {
  const result = await this.orchestrationPort.orchestratePatientCareWorkflow(
    session,
    { weight: 65, height: 170 },
    50 // max iterations
  );

  return result.val;
}
```

## 🔄 Adaptation des Données

### **Domaine → Application**

```typescript
// Dans l'implémentation du port
async getPendingMessages(session: PatientCareSession) {
  const domainMessages = session.getPendingMessages();

  // Adaptation pour l'application
  const appMessages = domainMessages.map(msg => ({
    id: msg.id,
    type: msg.type,
    content: msg.content,
    requiresResponse: msg.requiresResponse,
    decisionType: msg.decisionType
  }));

  return Result.ok(appMessages);
}
```

### **Application → Domaine**

```typescript
// Conversion des types pour le domaine
const domainContext = context
  ? {
      targetDate: context.targetDate
        ? DomainDateTime.create(context.targetDate).val
        : undefined,
      userResponse: context.userResponse
        ? {
            messageId: context.userResponse.messageId,
            response: context.userResponse.response,
            timestamp: DomainDateTime.now(),
            decisionData: context.userResponse.decisionData,
          }
        : undefined,
      phaseCode: context.phaseCode as CARE_PHASE_CODES,
      patientVariables: context.patientVariables,
    }
  : undefined;
```

## 🛡️ Gestion des Erreurs

### **Transformation des Erreurs**

```typescript
// Erreurs domaine → erreurs application
if (result.isFailure) {
  return Result.fail(`Échec opération: ${result.error}`);
}

// Erreurs avec contexte métier
if (result.isFailure) {
  return Result.fail("Échec synchronisation état");
}
```

### **Types d'Erreurs Gérées**

- ✅ **Erreurs de validation** : États invalides, données manquantes
- ✅ **Erreurs métier** : Règles domaine violées
- ✅ **Erreurs techniques** : Problèmes d'infrastructure
- ✅ **Erreurs de communication** : Messages non traités

## 📊 Avantages du Port Primaire

### **✅ Séparation des Préoccupations**

- **Use Cases** : Logique applicative pure
- **Port** : Adaptation et transformation
- **Domaine** : Règles métier et logique complexe

### **✅ Testabilité**

```typescript
// Mock du port pour les tests
const mockPort: IPatientCareOrchestrationPort = {
  initializePatientCareSession: jest.fn(),
  orchestratePatientCareWorkflow: jest.fn(),
  // ...
};
```

### **✅ Maintenabilité**

- **Contrats clairs** : Interface définit exactement les services
- **Évolution contrôlée** : Changements dans le domaine n'affectent pas les use cases
- **Dépendances explicites** : Injection claire des services

### **✅ Réutilisabilité**

- **Multiples implémentations** : Différentes stratégies d'orchestration
- **Configuration flexible** : Paramétrage selon les besoins
- **Extension facile** : Nouvelles méthodes sans casser l'existant

## 🎯 Patterns d'Utilisation

### **Factory Pattern**

```typescript
export class PatientCareUseCaseFactory {
  constructor(private readonly port: IPatientCareOrchestrationPort) {}

  createInitializeUseCase() {
    return new InitializePatientCareUseCase(this.port);
  }

  createWorkflowUseCase() {
    return new OrchestratePatientCareWorkflowUseCase(this.port);
  }
  // ...
}
```

### **Workflow Orchestrator**

```typescript
export class PatientCareWorkflowOrchestrator {
  constructor(private readonly port: IPatientCareOrchestrationPort) {}

  async orchestrateCompleteWorkflow(patientId: AggregateID) {
    // 1. Initialisation
    const session = await this.port.initializePatientCareSession(patientId);

    // 2. Orchestration automatique
    const result = await this.port.orchestratePatientCareWorkflow(session.val);

    // 3. Gestion des messages si nécessaire
    const messages = await this.port.getPendingMessages(session.val);
    if (messages.val.length > 0) {
      // Traiter les réponses...
    }

    return result;
  }
}
```

## 🔧 Configuration et Injection

### **Module DI (Dependency Injection)**

```typescript
// Configuration des dépendances
const orchestrator = new PatientCareOrchestratorService(
  carePhaseManager,
  dailyCareManager,
  dailyPlanApplicator,
  idGenerator
);

const orchestrationPort = new PatientCareOrchestrationPort(orchestrator);

// Injection dans les use cases
const useCaseFactory = new PatientCareUseCaseFactory(orchestrationPort);
```

### **Factory Statique**

```typescript
export class OrchestrationPortFactory {
  static create(orchestrator: IPatientCareOrchestratorService) {
    return new PatientCareOrchestrationPort(orchestrator);
  }
}
```

## 📈 Métriques et Monitoring

### **Points de Monitoring**

- ✅ **Taux de succès** des opérations d'orchestration
- ✅ **Temps de réponse** des appels au domaine
- ✅ **Nombre d'erreurs** par type d'opération
- ✅ **Utilisation des use cases** et patterns d'usage

### **Logs Structurés**

```json
{
  "port": "PatientCareOrchestrationPort",
  "method": "orchestratePatientCareWorkflow",
  "sessionId": "session_123",
  "duration": 1250,
  "success": true,
  "message": "Orchestration terminée en 1.25s"
}
```

## 🎯 Bonnes Pratiques

### **✅ Design Patterns**

- **Interface Segregation** : Interfaces spécifiques par domaine
- **Dependency Inversion** : Use cases dépendent d'interfaces, pas d'implémentations
- **Factory Pattern** : Création centralisée des use cases

### **✅ Gestion d'Erreurs**

- **Transformation** : Erreurs domaine → erreurs application
- **Contexte** : Messages d'erreur informatifs
- **Logging** : Traçabilité des erreurs

### **✅ Performance**

- **Async/Await** : Opérations non-bloquantes
- **Lazy Loading** : Chargement à la demande
- **Caching** : Mise en cache des données fréquentes

### **✅ Tests**

- **Mocks** : Tests unitaires avec mocks du port
- **Integration Tests** : Tests avec vraie implémentation
- **Contract Tests** : Validation des contrats d'interface

---

## 🎯 Conclusion

Le **port primaire `IPatientCareOrchestrationPort`** est l'**interface contractuelle** entre la couche application (use cases) et la couche domaine (orchestration).

Il garantit :

- ✅ **Séparation claire** des responsabilités
- ✅ **Testabilité** et maintenabilité
- ✅ **Évolutivité** et réutilisabilité
- ✅ **Robustesse** et fiabilité

**Le port primaire est le garant de l'architecture hexagonale ! 🔄🏗️**
