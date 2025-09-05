# Domain Event & Event Bus

**Fichier Source:** `core/shared/domain/events/DomainEvent.ts`

## 1. Vue d'Ensemble

Les **Événements de Domaine** (Domain Events) sont un patron de conception central en Domain-Driven Design. Un événement de domaine est un objet qui représente quelque chose d'important qui s'est produit dans le domaine. Ils sont utilisés pour communiquer des changements d'état entre différentes parties du système (différents agrégats ou modules) de manière découplée.

Par exemple, quand un `Patient` est créé, un événement `PatientCreatedEvent` est généré. D'autres parties du système, comme un module de notification ou de statistiques, peuvent s'abonner à cet événement et réagir en conséquence, sans que le module `Patient` n'ait à les connaître.

## 2. Intégration de la Bibliothèque `domain-eventrix`

Ce projet n'implémente pas son propre système d'événements. Il s'appuie entièrement sur la bibliothèque externe **`domain-eventrix`**.

Le fichier `DomainEvent.ts` agit comme une façade ou un point d'intégration central. Il importe les concepts clés de `domain-eventrix` et les ré-exporte pour qu'ils soient utilisés dans le reste de l'application.

> **Note pour les développeurs :** Pour une compréhension approfondie du fonctionnement interne des événements, il est recommandé de consulter la documentation de la bibliothèque `domain-eventrix`.

## 3. Concepts Clés Ré-exportés

Voici les principaux types et classes ré-exportés depuis `domain-eventrix` :

### `DomainEvent<Data>`
C'est la classe de base que tous les événements de domaine concrets doivent étendre. Elle contient des métadonnées comme l'ID de l'événement, la date de création, etc. Le type générique `Data` représente la charge utile (payload) de l'événement.

**Exemple d'un événement concret :**
```typescript
import { DomainEvent } from '@core/shared/domain/events';

// Définition de la charge utile de l'événement
interface PatientCreatedData {
  patientId: string;
  name: string;
}

// L'événement concret
export class PatientCreatedEvent extends DomainEvent<PatientCreatedData> {}
```

### `EventHandler<Data, T>`
C'est une interface qui définit un "gestionnaire" d'événement. C'est une classe qui contient la logique à exécuter en réponse à un événement.

### `bindEventHandler`
Un décorateur (ou une fonction similaire) utilisé pour lier une classe `EventHandler` à un `DomainEvent` spécifique. C'est ce qui permet au système de savoir quel handler appeler pour quel événement.

**Exemple d'un handler :**
```typescript
@bindEventHandler(PatientCreatedEvent)
export class SendWelcomeEmailOnPatientCreated implements EventHandler<PatientCreatedData, PatientCreatedEvent> {

  public handle(event: PatientCreatedEvent): void {
    console.log(`Sending welcome email to patient ${event.data.name} (ID: ${event.data.patientId})`);
    // Logique d'envoi d'email...
  }
}
```

## 4. L'Interface `IEventBus`

En plus de ré-exporter les concepts de la bibliothèque, le fichier définit une interface locale `IEventBus`. C'est une abstraction cruciale qui définit le contrat pour le bus d'événements de l'application. Cela permet au reste de l'application de dépendre de cette interface, et non de l'implémentation concrète de `domain-eventrix`.

```typescript
export interface IEventBus {
  publish<Data, T extends DomainEvent<Data>>(event: T): void;
  subscribe<Data, T>(handler: EventHandler<Data, T>): void;
  // ... autres méthodes
}
```

### Méthodes principales de l'`IEventBus` :
- `publish(event)` : Publie un événement sur le bus. L'événement n'est pas nécessairement traité immédiatement.
- `publishAndDispatchImmediate(event)` : Publie un événement et demande son traitement immédiat et asynchrone.
- `subscribe(handler)` : Abonne un `EventHandler` au bus pour qu'il puisse recevoir les événements auxquels il est lié.
- `unsubscribe(handler)` : Désabonne un `EventHandler`.
- `dispatch(eventType)` : Déclenche le traitement (l'appel aux handlers) pour tous les événements d'un certain type qui ont été publiés.

Cette architecture, basée sur une bibliothèque externe et une interface d'abstraction locale, fournit un système d'événements puissant et découplé, essentiel à la collaboration entre les différents modules du domaine.
