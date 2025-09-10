# Platform-Specific Implementations

## 1. Vue d'Ensemble

Ce projet est conçu pour fonctionner sur plusieurs plateformes, principalement **native** (via Expo pour iOS et Android) et **web**. Cependant, certaines fonctionnalités de bas niveau, en particulier celles qui interagissent avec le système d'exploitation ou le matériel, nécessitent des implémentations différentes pour chaque plateforme.

Par exemple :

- **Persistance des données :** L'application native utilise **Expo SQLite**, tandis que l'application web pourrait utiliser **IndexedDB**.
- **Authentification :** Le flux d'authentification Google est différent pour une application native et une application web.
- **Notifications :** Les API pour les notifications push sont spécifiques à chaque plateforme.
- **Système de fichiers :** L'accès au système de fichiers est géré différemment.

Pour gérer cette complexité, le projet adopte une stratégie basée sur une **convention de nommage de fichiers**, exploitant le système de résolution de modules de Metro (le bundler de React Native).

## 2. La Convention de Nommage

Lorsqu'un service ou un composant nécessite des implémentations différentes, les fichiers sont structurés comme suit :

- **`service.native.ts`** : Contient le code spécifique à la plateforme native (iOS/Android).
- **`service.web.ts`** : Contient le code spécifique à la plateforme web.
- **`service.ts`** : Un fichier "dispatcher" qui exporte la bonne implémentation en fonction de la plateforme sur laquelle le code est en cours d'exécution.

### Exemple avec le `DatabaseEngine`

Le service [DatabaseEngine](./services/DatabaseEngine.md) est un parfait exemple :

- `IDatabaseEngine.ts`: L'interface (le contrat), qui est agnostique de la plateforme.
- `engine.native.ts`: L'implémentation qui utilise `expo-sqlite`.
- `engine.web.ts`: (Hypothétique) Une implémentation qui utiliserait `IndexedDB`.
- `engine.ts`: Le point d'entrée.

## 3. Le Fichier "Dispatcher"

Le fichier central (`engine.ts` dans notre exemple) est généralement très simple. Il contient souvent une logique qui ressemble à ceci :

```typescript
// Exemple conceptuel de engine.ts

import { Platform } from "react-native";
import NativeEngine from "./engine.native";
import WebEngine from "./engine.web";

// On exporte la classe appropriée en fonction de la plateforme
const DatabaseEngine = Platform.OS === "web" ? WebEngine : NativeEngine;

export default DatabaseEngine;
```

Lorsque le bundler (Metro ou Webpack) voit une importation depuis `./engine`, il résout automatiquement le chemin vers le fichier correspondant à la plateforme cible (`.web.js` ou `.native.js`). Dans de nombreux cas, le simple fait d'avoir les extensions `.native.ts` et `.web.ts` suffit, et le bundler choisit le bon fichier sans qu'un fichier "dispatcher" explicite soit nécessaire.

## 4. Avantages de cette Approche

- **Séparation Claire :** Le code spécifique à une plateforme est clairement isolé dans son propre fichier, ce qui le rend plus facile à maintenir.
- **Code Partagé :** Le reste de l'application (le `core` et les composants de l'interface utilisateur) peut importer depuis le point d'entrée agnostique (`./engine`) sans jamais se soucier de la plateforme sur laquelle il s'exécute.
- **Extensibilité :** Il est facile d'ajouter le support pour une nouvelle plateforme à l'avenir en ajoutant simplement un nouveau fichier (par exemple, `service.desktop.ts`).

Cette stratégie est fondamentale pour la maintenabilité et la portabilité de la base de code du projet.
