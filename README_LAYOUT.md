# Configuration du Layout Racine (_layout.tsx)

## 📱 Vue d'ensemble

Le fichier `app/_layout.tsx` configure la structure racine de l'application MalNutrix avec tous les providers nécessaires et la navigation principale.

## 🏗️ Architecture des Providers

```typescript
// <KeyboardProvider>                // ⌨️ Gestion du clavier (temporairement désactivé)
  <UIProvider>                       // 🎨 Thème et composants UI
    <ToastProvider>                  // 🍞 Notifications toast
      <AppStateProvider>             // 📱 État global de l'app
        <EventProvider>              // 📡 Système d'événements
          <DatabaseProvider>         // 💾 Base de données
            <GoogleAuthProvider>     // 🔐 Authentification Google
              <NotificationProvider> // 🔔 Notifications push
                <NotificationServiceProvider> // 📢 Service de notifications
                  <PediatricAppProvider> // 🏥 Logique métier médicale
                    <InitializationProvider> // 🔄 Initialisation de l'app
                      <AppContent />   // 📱 Contenu de l'app
                    </InitializationProvider>
                  </PediatricAppProvider>
                </NotificationServiceProvider>
              </NotificationProvider>
            </GoogleAuthProvider>
          </DatabaseProvider>
        </EventProvider>
      </AppStateProvider>
    </ToastProvider>
  </UIProvider>
// </KeyboardProvider>
```

## 🔧 Fonctionnalités

### Splash Screen
- **Prévention auto-hide** : `SplashScreen.preventAutoHideAsync()`
- **Animation configurée** : Fade de 800ms avec `SplashScreen.setOptions()`
- **Gestion automatique** : Hook `useSplashScreen()` dans `AppContent`
- **Masquage différé** : Attente de 1.5 seconde pour le chargement initial

### Navigation Stack
- **Animations** : `slide_from_right`
- **Gestes** : Navigation horizontale activée
- **Headers** : Masqués par défaut
- **Écrans dynamiques** : Possibilité d'ajouter des écrans selon les besoins

## 🎯 Composants

### `RootLayout`
- **Fonction** : Layout racine avec tous les providers
- **Retour** : Structure complète de l'application

### `AppContent`
- **Hook** : `useSplashScreen()` pour gérer le splash screen
- **Retour** : `RootStack` après chargement

### `RootStack`
- **Configuration** : Options globales de navigation
- **Écrans** : Route index configurée
- **Extensible** : Possibilité d'ajouter d'autres écrans

## 🚀 Utilisation

### Ajouter un nouvel écran
```typescript
<Stack.Screen
  name="nouvel-ecran"
  options={{
    title: "Nouvel Écran",
    headerShown: true, // Si header souhaité
  }}
/>
```

### Gestion manuelle du splash screen
```typescript
import { hideSplashScreen, showSplashScreen } from '@/src/hooks';

// Masquer immédiatement
await hideSplashScreen();

// Afficher (empêcher auto-hide)
await showSplashScreen();
```

### Personnaliser l'animation du splash screen
```typescript
import * as SplashScreen from 'expo-splash-screen';

// Dans useSplashScreen() ou ailleurs
SplashScreen.setOptions({
  duration: 1000,  // Durée en ms (défaut: 400)
  fade: true,      // Animation de fondu (défaut: false)
});
```

## 📋 Providers Inclus

1. **KeyboardProvider** - Gestion avancée du clavier (react-native-keyboard-controller) *[Temporairement désactivé - nécessite rebuild]*
2. **UIProvider** - Thème et composants d'interface
3. **ToastProvider** - Notifications toast
4. **AppStateProvider** - État global de l'application
5. **EventProvider** - Système d'événements (domain-eventrix)
6. **DatabaseProvider** - Gestion de la base de données
7. **GoogleAuthProvider** - Authentification Google
8. **NotificationProvider** - Notifications push (actions utilisateur)
9. **NotificationServiceProvider** - Service de notifications (affichage)
10. **PediatricAppProvider** - Logique métier médicale
11. **InitializationProvider** - Initialisation et chargement des données médicales

## 🔄 Cycle de Vie

1. **Démarrage** : Splash screen affiché
2. **Chargement** : Providers initialisés
3. **Prêt** : Splash screen masqué automatiquement
4. **Navigation** : Stack navigation opérationnel

## 📝 Notes Techniques

- **React Native Reanimated** : Importé en premier pour les animations
- **Global CSS** : Styles globaux chargés
- **Splash Screen** : Géré automatiquement via hook personnalisé
- **Navigation** : Configuration Expo Router avec gestes activés

## 🛠️ Maintenance

Pour ajouter un nouveau provider :
1. L'importer en haut du fichier
2. L'ajouter dans la hiérarchie des providers
3. S'assurer de l'ordre logique (dépendances)

Pour modifier la navigation :
1. Ajouter/modifier les `Stack.Screen` dans `RootStack`
2. Configurer les options selon les besoins
3. Tester les animations et gestes
