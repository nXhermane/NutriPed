# Presentation Layer Overview

## 1. Vue d'Ensemble

La couche de présentation est responsable de tout ce que l'utilisateur voit et avec quoi il interagit. Elle est construite en utilisant **React Native** et est structurée autour de trois répertoires principaux : `app`, `components`, et `src`.

Son rôle est de :
- Afficher les données à l'utilisateur.
- Capturer les entrées de l'utilisateur.
- Appeler les [Cas d'Utilisation](../../core/shared/application/UseCase.md) appropriés pour déclencher la logique métier.
- Rester aussi "simple" que possible, en déléguant toute la logique complexe au `core` de l'application.

---

## 2. Le Routage avec Expo Router (`app/`)

L'application utilise **Expo Router** pour gérer la navigation. Il s'agit d'un système de routage basé sur le système de fichiers : la structure des dossiers et des fichiers à l'intérieur du répertoire `app/` définit directement les routes de l'application.

### Conventions de Nommage :
- **`index.tsx`**: Fichier qui correspond à la route de base d'un répertoire. Par exemple, `app/home/index.tsx` est l'écran pour la route `/home`.
- **`_layout.tsx`**: Un fichier spécial qui définit une mise en page partagée pour toutes les routes d'un même répertoire. Il est souvent utilisé pour ajouter un en-tête, un pied de page, ou une barre d'onglets.
- **Groupes de Routes `(dossier)/`**: Les dossiers entourés de parenthèses (ex: `(screens)`) permettent d'organiser les routes et de leur appliquer une mise en page commune via un `_layout.tsx`, sans que le nom du dossier n'apparaisse dans l'URL.
- **Routes Dynamiques `[param]/`**: Les dossiers ou fichiers entourés de crochets (ex: `[patientId].tsx`) créent des routes dynamiques. La valeur du paramètre est alors accessible dans le composant. Par exemple, le fichier `app/(screens)/patient_detail/[id].tsx` gère les routes comme `/patient_detail/1`, `/patient_detail/2`, etc.

---

## 3. La Stratégie des Composants (`components/`)

Le répertoire `components/` contient tous les composants React réutilisables. Il est intelligemment structuré pour séparer les différents types de composants :

- **`components/ui/`**
  - Contient la bibliothèque de composants de base de l'application. Il s'agit très probablement des composants de **Gluestack UI**, qui sont stylisés et ré-exportés pour être utilisés de manière cohérente dans toute l'application. On y trouve les briques de base comme `Button`, `Card`, `Input`, etc.

- **`components/custom/`**
  - Contient des composants personnalisés, construits à partir des briques de `components/ui`, qui sont réutilisables à plusieurs endroits de l'application. Par exemple, un `AppLogo` ou un `Loading` spinner personnalisé.

- **`components/pages/`**
  - Contient des composants plus larges et plus complexes qui ne sont utilisés que sur une page ou un écran spécifique. Par exemple, `components/pages/home/GreetingSession.tsx` est probablement un composant utilisé uniquement sur l'écran d'accueil. Cette organisation permet de ne pas polluer le dossier `custom` avec des composants à usage unique.

---

## 4. Flux de Données et Gestion de l'État (`src/`)

Le répertoire `src/` contient la "colle" qui connecte l'interface utilisateur (les composants) à la logique métier (le `core`).

- **`src/context/`**
  - Ce dossier utilise l'**API Context de React** pour l'injection de dépendances et la mise à disposition de services globaux. Par exemple, `PediatricAppContext.tsx` expose probablement les instances des cas d'utilisation et des services du `core` à l'ensemble de l'arbre de composants. Cela évite d'avoir à passer les dépendances de composant en composant ("prop drilling").

- **`src/hooks/`**
  - Ce dossier contient des **hooks React personnalisés**. C'est un patron de conception clé de l'application. Ces hooks encapsulent la logique d'interaction avec le `core`. Par exemple, un hook `usePatients()` pourrait :
    1.  Obtenir le `GetAllPatientsUseCase` depuis le contexte.
    2.  Gérer un état React (`useState`) pour stocker la liste des patients.
    3.  Utiliser `useEffect` pour appeler le cas d'utilisation au montage du composant.
    4.  Retourner la liste des patients, l'état de chargement, et d'éventuelles erreurs.
  - En utilisant ces hooks, les composants de l'interface utilisateur deviennent très simples : ils appellent simplement un hook et affichent les données retournées, sans se soucier de la manière dont elles ont été obtenues.

- **`src/store/`**
  - Ce dossier contient la configuration de **Redux Toolkit**, utilisé pour la gestion de l'état global de l'interface utilisateur (par exemple, l'état d'un formulaire complexe, les filtres actifs, etc.).
