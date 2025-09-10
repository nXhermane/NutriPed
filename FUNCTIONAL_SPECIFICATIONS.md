# Spécifications Fonctionnelles Détaillées - NutriPed

## Résumé Exécutif

**NutriPed** est une application mobile spécialisée dans l'évaluation et la prise en charge nutritionnelle des patients pédiatriques (0-19 ans). Construite selon une architecture DDD stricte avec React Native/Expo, elle offre un ensemble complet d'outils pour les professionnels de santé travaillant dans des contextes de malnutrition infantile.

### 🎯 Valeur Métier

- **Diagnostic automatisé** basé sur standards OMS avec calculs de Z-scores
- **Protocoles de soin standardisés** (F75/F100) avec gestion des phases
- **Suivi longitudinal** des indicateurs de croissance
- **Interface adaptée** aux contraintes des environnements médicaux

### 🔧 Architecture Technique

- **Domain-Driven Design** avec séparation claire des couches
- **Base de données SQLite** avec migrations automatisées
- **Calculs médicaux** utilisant bibliothèque smartcal
- **Événements domaine** pour workflows métier complexes

### 📊 Fonctionnalités Core

1. **Gestion Patients** - CRUD complet avec validation métier
2. **Évaluation Anthropométrique** - 8 types de mesures avec calculs automatiques
3. **Diagnostic Nutritionnel** - Classification MAS sévère/modéré
4. **Protocoles Thérapeutiques** - 4 phases de soin avec critères de transition
5. **Courbes de Croissance** - Visualisation selon standards OMS
6. **Système de Rappels** - Notifications programmées pour suivi

### 👥 Utilisateur Cible

**Professionnels de santé** (pédiatres, nutritionnistes) travaillant dans :

- Centres de nutrition thérapeutique
- Hôpitaux pédiatriques
- Programmes de santé publique
- Contextes humanitaires

### 📈 État d'Avancement

- ✅ **Architecture complète** et patterns établis
- ✅ **Logique métier** définie et testée
- ✅ **Base de données** avec schémas et migrations
- 🔄 **Interface utilisateur** partiellement implémentée
- 🔄 **Moteur de diagnostic** nécessite finalisation UI
- ❌ **Synchronisation** à implémenter

---

## Vue d'ensemble du Projet

### Objectif Principal

NutriPed est une application mobile cross-platform conçue pour les professionnels de santé afin de gérer et évaluer l'état nutritionnel des patients pédiatriques. Elle fournit un ensemble d'outils robustes pour la collecte de données, l'analyse et le diagnostic, basés sur des normes médicales établies selon les standards OMS et autres références internationales.

### Stack Technologique Identifiée

- **Framework Core**: React Native avec Expo
- **Langage**: TypeScript
- **Architecture**: Domain-Driven Design (DDD) stricte
  - `core`: Logique métier pure (entités, agrégats, services domaine)
  - `adapter`: Infrastructure (persistence, API externes, services techniques)
  - `app`: Présentation (composants UI, navigation, state management)
- **UI**: Gluestack UI + NativeWind (Tailwind CSS)
- **State Management**: Redux Toolkit avec redux-persist
- **Navigation**: Expo Router (file-system based routing)
- **Base de données**: Drizzle ORM avec Expo-SQLite
- **Validation**: Zod pour la validation des données
- **Injection de dépendances**: tsyringe
- **Événements**: domain-eventrix pour les événements de domaine
- **Calculs**: Bibliothèque smartcal pour les formules médicales

### Architecture Générale

L'application suit une architecture hexagonale/DDD en couches :

- **Présentation** (`app/`): Interfaces utilisateur et orchestration
- **Domaine** (`core/`): Règles métier, entités, agrégats, services domaine
- **Infrastructure** (`adapter/`): Implémentations techniques des ports domaine

## Inventaire des Fonctionnalités

### Fonctionnalités Core (Critiques)

#### Gestion des Patients

- **Création de patients**: Formulaire complet avec informations démographiques (nom, sexe, date de naissance, parents, contact, adresse)
- **Localisation code**: `app/(screens)/patient_detail/`, `core/patient/`
- **État actuel**: Implémenté avec validation Zod et stockage SQLite

#### Évaluation Nutritionnelle

- **Collecte de données anthropométriques**: Poids, taille, périmètre crânien, MUAC
- **Localisation code**: `core/evaluation/`, `adapter/evaluation/`
- **État actuel**: Schéma de base défini, moteur d'évaluation en développement

#### Diagnostic Automatisé

- **Calcul des Z-scores**: Weight-for-Age, Height-for-Age, Weight-for-Height selon standards OMS
- **Localisation code**: `core/nutrition_care/`
- **État actuel**: Logique métier définie, interface en cours d'implémentation

### Fonctionnalités Importantes

#### Authentification Google

- **Connexion sécurisée**: Via Google Sign-In
- **Localisation code**: `src/context/GoogleAuthProvider.tsx`
- **État actuel**: Implémenté et fonctionnel

#### Gestion des Dossiers Médicaux

- **Historique patient**: Suivi chronologique des évaluations
- **Localisation code**: `core/medical_record/`
- **État actuel**: Structure définie, implémentation partielle

#### Courbes de Croissance

- **Visualisation interactive**: Graphiques de croissance selon âge
- **Localisation code**: `app/(screens)/growth_chart/`, `components/pages/growth_chart/`
- **État actuel**: Composants UI présents, logique métier à compléter

### Fonctionnalités Secondaires

#### Système de Rappels

- **Notifications programmées**: Rappels pour les évaluations de suivi
- **Localisation code**: `core/reminders/`, `adapter/reminders/`
- **État actuel**: Infrastructure de base présente

#### Export/Import de Données

- **Formats supportés**: XLSX, ZIP
- **Localisation code**: `adapter/services/ZipProcessor/`, `utils/loadXlsxTemplate.ts`
- **État actuel**: Utilitaires présents, intégration partielle

#### Outils de Calcul Pédiatrique

- **Calculateurs spécialisés**: Conversions âge/poids, etc.
- **Localisation code**: `app/(screens)/tools/`, `utils/`
- **État actuel**: Utilitaires développés, interface à finaliser

## Modèle de Données

### Entités Principales Identifiées

#### Patient

```typescript
{
  id: string (primary key)
  createdAt: string
  updatedAt: string
  name: string (required, max 200 chars)
  gender: "M" | "F" | "O" (required)
  birthday: string (required)
  parents: {
    mother?: string
    father?: string
  }
  contact: {
    email: string (required)
    tel: string (required)
  } (required)
  address: {
    street?: string
    city?: string
    postalCode?: string
    country: string (required)
  } (required)
  registrationDate: string (required)
}
```

#### Évaluation

- Données anthropométriques (poids, taille, périmètre crânien)
- Signes cliniques observés
- Résultats biologiques

#### Dossier Médical

- Historique des évaluations
- Diagnostics générés
- Traitements recommandés

### Relations entre Entités

- **1 Patient** → **N Évaluations** (One-to-Many)
- **1 Patient** → **1 Dossier Médical** (One-to-One)
- **1 Évaluation** → **1 Diagnostic** (One-to-One)

### Champs Obligatoires/Optionnels

- **Obligatoires**: ID, timestamps, nom, sexe, date naissance, contact, adresse, date enregistrement
- **Optionnels**: Informations parents, détails d'adresse (sauf pays)

### Validations Métier Détectées

- Format date: Validation des dates de naissance
- Genre: Enumération stricte (M/F/O)
- Email: Format email valide
- Téléphone: Format téléphone valide
- Longueur maximale: 200 caractères pour le nom
- **Âge limite**: Maximum 19 ans pour les patients pédiatriques
- **Événements domaine**: Changement d'âge/sexe déclenche recalcul automatique

## Logique Métier Détaillée

### Règles de Validation Patient

```typescript
// Règles métier extraites du code
PATIENT_MAX_AGE_IN_YEAR = 19
- Validation automatique de l'âge à la création/modification
- Exception ArgumentOutOfRangeException si âge > 19 ans
- Événements domaine pour changements critiques (âge/sexe)
```

### Calculs Anthropométriques

#### Indicateurs de Croissance

**Structure des Indicateurs**:

```typescript
interface IIndicator {
  code: SystemCode;
  name: string;
  neededMeasureCodes: SystemCode[]; // Mesures requises
  axeX: Formula; // Formule axe X (âge)
  axeY: Formula; // Formule axe Y (mesure)
  availableRefCharts: AvailableChart[];
  usageConditions: Condition; // Conditions d'utilisation
  interpretations: IndicatorInterpreter[];
  zScoreComputingStrategy: ZScoreComputingStrategyType;
  standardShape: StandardShape;
}
```

#### Stratégies de Calcul Z-Score

- **AGE_BASED**: Calcul basé sur l'âge (Weight-for-Age, Height-for-Age)
- **LENHEI_BASED**: Calcul basé sur taille/poids (BMI-for-Age)
- **TABLE_BASED**: Utilisation de tables de référence

#### Constantes Anthropométriques

```typescript
MAX_WEIGHT = 58.0 kg
MIN_WEIGHT = 0.9 kg
MIN_LENHEI = 38.0 cm
MAX_LENHEI = 150.0 cm
MAX_AGE_TO_USE_AGE_IN_DAY = 5 ans (1825 jours)
DAY_IN_MONTHS = 30.4375
DAY_IN_YEARS = 365.25
```

### Protocoles de Soin Nutritionnel

#### Phases de Soin (CarePhaseReference)

```typescript
interface ICarePhaseReference {
  code: CARE_PHASE_CODES;
  name: string;
  description: string;
  nextPhase?: CARE_PHASE_CODES; // Phase suivante
  prevPhase?: CARE_PHASE_CODES; // Phase précédente
  applicabilyConditions: Criterion[]; // Conditions d'applicabilité
  failureCriteria: Criterion[]; // Critères d'échec
  transitionCriteria: Criterion[]; // Critères de transition
  recommendedTreatments: RecommendedTreatment[];
  monitoringPlan: MonitoringElement[];
  followUpPlan: FollowUpAction[];
}
```

#### Codes de Phases de Soin

- **CNT_PHASE1**: Phase aiguë (F75/F100)
- **CNT_TRANS_PHASE**: Phase de transition
- **CNT_PHASE2**: Phase de réhabilitation
- **CNT_INFANT_LT6m_LT3kg**: Nourrissons <6 mois <3kg

#### Traitements Recommandés

- **Nutritionnel**: F75, F100, F100 dilué
- **Systématique**: Antibiotiques (Amoxicilline)
- **Fréquences**: 8 prises/jour pour F100, 5-6 pour autres

### Système de Rappels et Notifications

#### Structure des Rappels

```typescript
interface IReminder {
  title: string;
  message: string;
  trigger: ReminderTrigger; // Condition de déclenchement
  reminderCreatedAt: DateTime;
  isActive: boolean;
  actions: ReminderAction[]; // Actions à exécuter
}
```

#### Types de Déclencheurs

- **Date/heure spécifique**
- **Récurrent** (quotidien, hebdomadaire)
- **Conditionnel** (basé sur données patient)

#### Actions de Rappel

- **Notification push**
- **Email**
- **Actions dans l'application**

### Événements de Domaine

#### Événements Patient

- **PatientCreatedEvent**: Création patient
- **PatientAgeOrGenderUpdatedEvent**: Changement âge/sexe
- **PatientDeletedEvent**: Suppression patient

#### Événements Évaluation

- **Évaluation créée/modifiée**
- **Diagnostic généré/corrigé**
- **Données anthropométriques changées**

#### Workflows Déclenchés

1. **Changement âge/sexe** → Recalcul automatique des Z-scores
2. **Nouvelle mesure** → Validation et mise à jour diagnostic
3. **Échec phase de soin** → Changement automatique de protocole

### Mesures Anthropométriques

#### Types de Mesures

```typescript
enum AnthroSystemCodes {
  HEIGHT = "height", // Taille
  LENGTH = "length", // Longueur (couché)
  LENHEI = "lenhei", // Taille/longueur
  WEIGHT = "weight", // Poids
  BMI = "bmi", // IMC
  HEAD_CIRCUMFERENCE = "head_circumference", // PC
  MUAC = "muac", // Bras
  TSF = "tsf", // Pli tricipital
  SSF = "ssf", // Pli sous-scapulaire
}
```

#### Unités et Validations

- **Poids**: kg (0.9 - 58.0)
- **Taille**: cm (38.0 - 150.0)
- **Âge**: jours/mois/années selon contexte
- **MUAC**: mm (défaut: 140mm pour nourrissons)

#### Règles de Conversion

- **Âge en jours**: Pour enfants <5 ans
- **Âge en mois**: Pour calculs standards
- **Formules**: axeX = f(âge), axeY = f(mesure)

### Standards de Référence

#### Organismes de Référence

- **OMS (WHO)**: Standards internationaux
- **NCHS**: National Center for Health Statistics
- **CDC**: Centers for Disease Control

#### Courbes de Croissance Disponibles

- **Poids/Taille**: Boys/Girls 45-110cm
- **IMC/Âge**: Boys/Girls 0-5 ans et 5-19 ans
- **Poids/Âge**: Boys/Girls 0-5 ans et 5-10 ans
- **Taille/Âge**: Boys/Girls 0-5 ans et 5-19 ans
- **PC/Âge**: Boys/Girls 0-5 ans
- **MUAC/Âge**: Boys/Girls 3 mois-5 ans

### Signes Cliniques et Observations

#### Signes Vitaux

```typescript
VITAL_SIGNS = {
  TEMPERATURE: "vital_sign_temperature",
  RESPIRATORY_RATE: "vital_sign_respiratory_rate",
};
```

#### Signes Cliniques Majeurs

- **Hyperthermie/Hypothermie**
- **Hypoglycémie**
- **Diarrhée/Vomissements**
- **Dénutrition sévère**
- **Œdème**

#### Observations Systématiques

- **État cutané, pileux, unguéal**
- **Cornée, bouche, hémorragies**
- **État musculaire, neurologique**
- **Foie, articulations, cœur**

### Tests et Examens Biologiques

#### Biochimie

```typescript
BIOCHEMICAL_REF_CODES = {
  BIOCHEMICAL_IONO_NA: "biochemical_iono_na", // Sodium
  BIOCHEMICAL_IONO_K: "biochemical_iono_k", // Potassium
  BIOCHEMICAL_KIDNEY_UREA: "biochemical_kidney_urea",
  BIOCHEMICAL_BLOOD_GLUCOSE: "biochemical_blood_glucose",
  BIOCHEMICAL_ENZY_ALT: "biochemical_enzy_alt", // ALAT
};
```

#### Interprétation des Résultats

- **UNDER**: Valeur sous la normale
- **NORMAL**: Valeur dans les normes
- **OVER**: Valeur au-dessus de la normale

### Médicaments et Posologies

#### Classes Thérapeutiques

- **Antibactériens**: Amoxicilline, Gentamicine, Ciprofloxacine
- **Antifongiques**: Nystatine, Fluconazole
- **Antipaludéens**: Diverse
- **Cardiaques**: Furosémide

#### Routes d'Administration

- **Oral**: Comprimés, suspensions
- **IV/IM**: Injections
- **Topique**: Applications locales
- **Rectal**: Suppositoires

#### Calculs de Posologie

- **Par kg**: mg/kg/jour
- **Par surface corporelle**: mg/m²
- **Fréquences**: q6h, q8h, q12h, q24h

### Algorithmes et Formules de Calcul

#### Calcul des Z-Scores

**Formule Générale Z-Score**:

```
Z = (valeur_mesurée - médiane_référence) / écart_type_référence
```

**Stratégies par Type d'Indicateur**:

- **Age-based**: Utilise l'âge exact en jours/mois/années
- **Length/Height-based**: Utilise la taille comme référence
- **Table-based**: Interpolation dans tables de référence

#### Conversions d'Âge

```typescript
// Conversions automatiques selon le contexte
ageInDays = ageInYears * DAY_IN_YEARS;
ageInMonths = ageInDays / DAY_IN_MONTHS;
ageInYears = ageInMonths / MONTH_IN_YEARS;
```

#### Calcul de l'IMC (BMI)

```
BMI = poids_kg / (taille_m)²
```

#### Interprétation des Z-Scores

```typescript
enum GrowthIndicatorRange {
  ABOVE_4 = "above +4", // > +4 SD (Très au-dessus)
  ABOVE_3 = "above +3", // +3 à +4 SD (Au-dessus)
  ABOVE_2 = "above +2", // +2 à +3 SD (Au-dessus)
  ABOVE_1 = "above +1", // +1 à +2 SD (Au-dessus)
  MEDIAN = "0", // -1 à +1 SD (Normal)
  BELOW_M1 = "below -1", // -1 à -2 SD (En-dessous)
  BELOW_M2 = "below -2", // -2 à -3 SD (En-dessous)
  BELOW_M3 = "below -3", // -3 à -4 SD (En-dessous)
  BELOW_M4 = "below -4", // < -4 SD (Très en-dessous)
}
```

### Workflows Métier Détaillés

#### Workflow de Création Patient

1. **Saisie des données** → Validation temps réel
2. **Vérification âge** → Exception si > 19 ans
3. **Création entité Patient** → Application des règles métier
4. **Émission événement** → `PatientCreatedEvent`
5. **Persistance** → Sauvegarde SQLite
6. **Confirmation** → Feedback utilisateur

#### Workflow d'Évaluation Anthropométrique

1. **Sélection patient** → Chargement données existantes
2. **Saisie mesures** → Validation par type de mesure
3. **Calcul automatique** → Z-scores selon indicateurs
4. **Application conditions** → Filtres par âge/sexe
5. **Génération diagnostic** → Application règles médicales
6. **Sauvegarde historique** → Traçabilité des modifications
7. **Émission événements** → Notifications système

#### Workflow de Diagnostic Nutritionnel

1. **Collecte données multi-sources**:
   - Anthropométrie
   - Signes cliniques
   - Biologie (si disponible)
2. **Évaluation holistique**:
   - Analyse Z-scores
   - Interprétation signes cliniques
   - Corrélation données biologiques
3. **Classification automatique**:
   - MAS sévère/modéré
   - Dénutrition chronique/aiguë
   - Obésité/surpoids
4. **Génération recommandations**:
   - Protocoles thérapeutiques
   - Fréquences alimentation
   - Traitements associés
5. **Plan de suivi**:
   - Fréquences de contrôle
   - Critères d'alerte
   - Objectifs de récupération

#### Workflow de Gestion des Phases de Soin

1. **Évaluation critères d'entrée**:
   - Poids/taille/Z-scores
   - Signes cliniques
   - État général
2. **Sélection phase appropriée**:
   - Phase 1 (stabilisation)
   - Phase transition
   - Phase 2 (rattrapage)
3. **Application protocole**:
   - Alimentation spécifique
   - Traitements médicamenteux
   - Surveillance rapprochée
4. **Monitoring continu**:
   - Pesées quotidiennes
   - Évaluation clinique
   - Ajustements thérapeutiques
5. **Évaluation critères de sortie**:
   - Récupération pondérale
   - Disparition signes cliniques
   - Stabilité métabolique

### Règles Métier Critiques

#### Règles de Sécurité Alimentaire

- **F75**: 130 kcal/100ml, dilution stricte
- **F100**: 100 kcal/100ml, administration contrôlée
- **Fréquences**: Maximum 8 prises/jour pour F100
- **Quantités**: Calculées par kg de poids corporel

#### Critères de Sévérité

```typescript
// Classification MAS sévère
const severeWasting = {
  weightForHeight: zScore < -3,
  muac: muac < 115, // mm
  bilateralOedema: true,
};

// Classification MAS modéré
const moderateWasting = {
  weightForHeight: zScore >= -3 && zScore < -2,
  muac: muac >= 115 && muac < 125,
  bilateralOedema: false,
};
```

#### Protocoles d'Urgence

- **Réhydratation**: Selon degré de déshydratation
- **Antibiothérapie**: Amoxicilline systématique phase 1
- **Lutte contre l'hypothermie**: Couvertures, sources chaleur
- **Traitement hypoglycémie**: Glucose 10% IV/oral

#### Gestion des Complications

- **Infections**: Traitement antibiotique adapté
- **Œdème**: Restriction hydrique, diurétiques
- **Dénutrition sévère**: Apports progressifs
- **Troubles métaboliques**: Correction ionique

### Métriques et Indicateurs de Performance

#### Indicateurs de Qualité des Soins

- **Taux de récupération**: % patients atteignant objectifs
- **Durée moyenne de séjour**: Par phase de soin
- **Taux de complications**: % patients avec complications
- **Mortalité**: Taux par tranche d'âge

#### Indicateurs Anthropométriques

- **Vitesse de gain pondéral**: g/kg/jour
- **Évolution Z-scores**: Amélioration mensuelle
- **Rattrapage statural**: cm/mois
- **Évolution PC**: mm/mois

#### Indicateurs de Processus

- **Délai diagnostic**: Minutes après admission
- **Temps de saisie**: Minutes par évaluation
- **Taux d'erreurs**: % données incorrectes
- **Couverture vaccinale**: % patients à jour

### Intégrations et Interfaces Externes

#### Formats d'Import/Export

- **XLSX**: Tableurs Excel pour données patients
- **ZIP**: Archives compressées pour médias
- **PDF**: Rapports d'évaluation et diagnostics
- **JSON**: Échange de données structurées

#### APIs et Services Externes

- **Google Sign-In**: Authentification utilisateur
- **Expo Notifications**: Notifications push
- **Expo File System**: Gestion fichiers locaux
- **Expo Sharing**: Partage de documents

#### Synchronisation de Données

- **Locale**: SQLite avec migrations Drizzle
- **Persistante**: redux-persist pour state
- **Sécurisée**: Chiffrement des données sensibles
- **Offline-first**: Fonctionnement déconnecté

### Considérations Techniques pour l'UX

#### Performance Mobile

- **Bundle size**: Optimisation des dépendances
- **Memory usage**: Gestion des gros datasets
- **Battery impact**: Calculs optimisés
- **Storage**: Gestion espace disque

#### Accessibilité

- **Screen readers**: Support vocal
- **Large text**: Échelles adaptatives
- **High contrast**: Thèmes accessibles
- **Touch targets**: Cibles tactiles 44pt minimum

#### Internationalisation

- **Langues**: Support français prioritaire
- **Formats**: Dates, nombres locaux
- **Unités**: kg/cm vs lbs/in selon région
- **Standards**: OMS locaux vs internationaux

## 🔄 Workflows Détaillés des Use Cases

### Use Case: Calcul d'Indicateur de Croissance

#### 🎯 **Objectif Fonctionnel**

Calculer automatiquement les Z-scores et percentiles pour un indicateur anthropométrique spécifique (poids/âge, taille/âge, IMC/âge, etc.) en fonction des données patient et des standards de référence OMS.

#### 📊 **Données d'Entrée Requises**

```typescript
CalculateGrowthIndicatorValueRequest = {
  indicatorCode: "wfa" | "hfa" | "bfa" | "wflh", // Code indicateur
  anthropometricData: {
    weight?: number,      // kg (0.9-58.0)
    height?: number,      // cm (38.0-150.0)
    length?: number,      // cm (couché)
    head_circumference?: number, // cm
    muac?: number,        // mm
  },
  sex: "M" | "F" | "O",
  age_in_day: number,     // 0-6570 (19 ans)
  age_in_month: number    // 0-228 (19 ans)
}
```

#### 🔄 **Workflow Détaillé - Étape par Étape**

**Étape 1: Validation des Données Brutes**

```
Données saisies → Validation par type de mesure → Résultat validation
     ↓
- Vérification plages (poids 0.9-58kg, taille 38-150cm)
- Contrôle cohérence (taille > poids pour nourrissons)
- Validation âge (0-19 ans)
```

**Étape 2: Génération Variables Anthropométriques**

```
Données validées → Calcul variables dérivées → Objet AnthropometricVariableObject
     ↓
- age_in_year = age_in_day / 365.25
- bmi = weight_kg / (height_m)²
- lenhei = length || height (selon âge)
- Conversion unités automatiques
```

**Étape 3: Sélection Indicateur et Référence**

```
Variables + Code → Recherche indicateur → Sélection référence OMS
     ↓
- Vérification conditions d'utilisation (âge, sexe)
- Sélection courbe/table appropriée
- Application filtres par tranche d'âge
```

**Étape 4: Calcul du Z-Score**

```
Variables + Indicateur + Référence → Application stratégie → Z-Score + Coordonnées
     ↓
Age-based: Utilise âge exact pour interpolation
Lenhei-based: Utilise taille comme référence
Table-based: Interpolation dans matrices
```

**Étape 5: Interprétation et Formatage**

```
Z-Score brut → Classification médicale → Résultat formaté
     ↓
- Application seuils (-4 à +4 SD)
- Génération interprétation clinique
- Calcul percentile équivalent
```

#### 🎨 **Connexions UX - Comment l'Aborder**

**Interface de Saisie:**

- **Contexte**: Écran dédié par type d'évaluation (croissance, dépistage, suivi)
- **Données nécessaires**: Formulaire adaptatif selon âge (mesures différentes <2ans vs >2ans)
- **Validation temps réel**: Feedback immédiat sur valeurs aberrantes
- **Progression**: Indicateur visuel de complétude (3/8 mesures saisies)

**Affichage des Résultats:**

- **Visualisation**: Graphique courbe de croissance avec point patient
- **Classification**: Code couleur (vert=normal, jaune=risque, rouge=urgence)
- **Interprétation**: Texte explicatif selon classification
- **Actions**: Boutons contextuels (recalculer, corriger, exporter)

**Gestion d'Erreurs:**

- **Types d'erreurs**: Valeurs hors plage, données manquantes, incohérences
- **Feedback**: Messages spécifiques avec suggestions de correction
- **Récupération**: Possibilité de modifier sans perdre le contexte

### Use Case: Diagnostic Nutritionnel Global

#### 🎯 **Objectif Fonctionnel**

Établir un diagnostic nutritionnel complet en intégrant données anthropométriques, cliniques et biologiques pour classifier l'état nutritionnel (MAS, stunting, wasting, etc.).

#### 📊 **Contexte de Données Nécessaires**

```typescript
PatientDiagnosticData = {
  // Données patient de base
  patientId: string,
  sex: "M" | "F" | "O",
  birthday: string,
  age_in_day: number,

  // Mesures anthropométriques
  anthropometricData: AnthropometricData,

  // Signes cliniques
  clinicalSigns: ClinicalData,

  // Analyses biologiques
  biologicalTests: BiologicalTestResult[]
}
```

#### 🔄 **Workflow Diagnostic Multi-Étapes**

**Étape 1: Collecte Données Multi-Sources**

```
Patient sélectionné → Chargement données existantes → Complétion manquante
     ↓
Anthropométrie (obligatoire) ←→ Clinique (recommandé) ←→ Biologie (optionnel)
```

**Étape 2: Calculs Anthropométriques Automatiques**

```
Données brutes → Calculs parallèles → Résultats Z-scores
     ↓
- Weight-for-Age (WFA)
- Height-for-Age (HFA)
- BMI-for-Age (BFA)
- Weight-for-Height (WFH)
- MUAC-for-Age (optionnel)
```

**Étape 3: Analyse Clinique Structurée**

```
Signes observés → Classification par système → Score de gravité
     ↓
- Signes vitaux (température, RR)
- Signes cutanés/pileux/unguéaux
- État musculaire/neurologique
- Symptômes digestifs/respiratoires
```

**Étape 4: Intégration Biologique**

```
Résultats labo → Interprétation pathologique → Impact nutritionnel
     ↓
- Ionogramme (Na, K, Ca, Mg)
- Glycémie, urée, créatinine
- Enzymes hépatiques (ALAT)
- Numération formule sanguine
```

**Étape 5: Diagnostic Holistique**

```
Tous résultats → Application algorithmes → Classification finale
     ↓
- Règles MAS sévère/modéré
- Critères stunting/chronic malnutrition
- Détection complications associées
- Génération recommandations thérapeutiques
```

#### 🎨 **Connexions UX - Workflow Diagnostic**

**Écran Principal Diagnostic:**

- **Navigation**: Onglets par catégorie (Anthropo/Clinique/Biologie/Résultats)
- **Progression**: Barre de progression avec validation automatique
- **Sauvegarde**: Auto-save toutes les 30 secondes avec indicateur

**Interface Anthropométrique:**

- **Layout adaptatif**: Grille responsive selon nombre de mesures
- **Calcul temps réel**: Z-scores mis à jour à chaque saisie
- **Visualisations**: Mini-graphiques intégrés pour chaque indicateur
- **Comparaisons**: Valeurs précédentes pour suivi évolution

**Section Clinique:**

- **Organisation**: Groupement par système (cardiovasculaire, digestif, etc.)
- **Saisie intelligente**: Suggestions basées sur âge et symptômes associés
- **Photos**: Possibilité attachement photos pour signes cutanés
- **Historique**: Évolution signes cliniques sur consultations précédentes

**Résultats et Interprétation:**

- **Dashboard synthèse**: Vue d'ensemble avec scores clés
- **Détail par indicateur**: Drill-down pour comprendre chaque calcul
- **Recommandations**: Actions priorisées avec urgences médicales
- **Export**: Génération rapport PDF avec graphiques

### Use Case: Gestion des Phases de Soin

#### 🎯 **Objectif Fonctionnel**

Gérer automatiquement la progression du patient à travers les phases de traitement nutritionnel (Phase 1 aiguë → Phase transition → Phase 2 réhabilitation) avec critères de transition objectifs.

#### 📊 **Modèle de Données Phase**

```typescript
CarePhaseReference = {
  code: "cnt_phase1" | "cnt_trans_phase" | "cnt_phase2",
  name: string,
  description: string,
  nextPhase?: string,
  prevPhase?: string,

  // Critères d'admission
  applicabilyConditions: Condition[],

  // Critères de sortie/échec
  failureCriteria: Condition[],
  transitionCriteria: Condition[],

  // Traitements associés
  recommendedTreatments: Treatment[],

  // Plan de monitoring
  monitoringPlan: MonitoringElement[],

  // Actions de suivi
  followUpPlan: FollowUpAction[]
}
```

#### 🔄 **Workflow de Gestion des Phases**

**Étape 1: Évaluation Critères d'Admission**

```
État patient → Vérification conditions → Admission phase appropriée
     ↓
- Z-score WFH < -3 (Phase 1 MAS sévère)
- Z-score WFH -3 à -2 (Phase 1 MAS modéré)
- Amélioration WFH + récupération (Transition)
- Z-score WFH > -2 + stabilité (Phase 2)
```

**Étape 2: Application Protocole Thérapeutique**

```
Phase déterminée → Chargement protocole → Application traitements
     ↓
Phase 1: F75/F100 + Amoxicilline + Surveillance rapprochée
Transition: F100 dilué + poursuite antibiothérapie
Phase 2: F100 + diversification alimentaire + éducation
```

**Étape 3: Monitoring Quotidien**

```
Plan monitoring → Collecte données → Évaluation progression
     ↓
- Pesée quotidienne (gain pondéral cible: 5-10g/kg/jour)
- Évaluation clinique (disparition œdème, amélioration état général)
- Contrôle complications (infections, troubles métaboliques)
```

**Étape 4: Évaluation Critères de Transition**

```
Données monitoring → Test critères → Décision transition
     ↓
- Récupération pondérale ≥ 15% poids admission
- Disparition œdème bilateral
- Amélioration état clinique
- Absence complications actives
```

#### 🎨 **Connexions UX - Gestion des Phases**

**Dashboard Phase Active:**

- **Header**: Phase actuelle avec durée écoulée/cible
- **Métriques clés**: Poids actuel, gain journalier, jours restants
- **Alertes**: Indicateurs couleur pour objectifs (vert=atteint, rouge=risque)
- **Timeline**: Visualisation progression avec jalons critiques

**Interface Monitoring Quotidien:**

- **Saisie rapide**: Formulaire optimisé pour saisie en 2 minutes
- **Calculs automatiques**: Gain pondéral, pourcentage récupération
- **Tendances**: Graphiques évolution sur 7 derniers jours
- **Prédictions**: Projection durée phase basée sur tendance actuelle

**Gestion des Transitions:**

- **Évaluation automatique**: Test critères en background
- **Notification**: Alerte quand critères remplis
- **Validation médicale**: Confirmation avant transition
- **Documentation**: Traçabilité décisions avec justifications

### Use Case: Système de Rappels et Suivi

#### 🎯 **Objectif Fonctionnel**

Gérer automatiquement les rappels pour consultations de suivi, vaccinations, et contrôles nutritionnels selon les protocoles établis.

#### 📊 **Modèle de Rappels**

```typescript
Reminder = {
  title: string,           // "Contrôle nutritionnel J+7"
  message: string,         // "Rendez-vous pour pesée et évaluation"
  trigger: ReminderTrigger, // Quand déclencher
  isActive: boolean,       // Actif/inactif
  actions: ReminderAction[] // Actions à exécuter
}
```

#### 🔄 **Workflow de Gestion des Rappels**

**Étape 1: Création Automatique**

```
Événement → Analyse règles → Génération rappels
     ↓
Admission CNT: Rappels J+1, J+3, J+7, J+14
Transition phase: Rappels J+1, J+3
Sortie CNT: Rappels M+1, M+3, M+6
```

**Étape 2: Déclenchement Intelligent**

```
Conditions remplies → Vérification contexte → Notification
     ↓
- Date/heure spécifique
- Basé sur données patient (âge, phase traitement)
- Conditionnel (si pas venu en consultation)
```

**Étape 3: Actions Contextuelles**

```
Rappel déclenché → Exécution actions → Suivi résultat
     ↓
- Notification push sur app
- Email aux parents/tuteurs
- Création tâche dans agenda médical
- Mise à jour statut patient
```

#### 🎨 **Connexions UX - Gestion des Rappels**

**Centre de Notifications:**

- **Inbox**: Liste rappels par urgence (critique/important/normal)
- **Filtrage**: Par patient, par type, par échéance
- **Actions groupées**: Marquer lu, reporter, déléguer
- **Historique**: Traçabilité actions sur chaque rappel

**Configuration par Patient:**

- **Règles personnalisées**: Ajustement fréquences selon évolution
- **Contacts**: Définition destinataires (médecin, parents, infirmier)
- **Canaux**: Choix modalités (app, SMS, email)
- **Fuseaux horaires**: Adaptation horaires locales

**Tableau de Bord Suivi:**

- **Métriques**: Taux réponse rappels, délais consultation
- **Tendances**: Évolution couverture suivi par période
- **Alertes**: Patients sans consultation depuis X jours
- **Rapports**: Génération statistiques couverture

## 🔗 Connexions Entre les Notions

### Flux de Données Interconnecté

#### De l'Anthropométrie au Diagnostic

```
Mesures brutes → Validation → Calculs Z-score → Classification → Diagnostic
     ↓
Interface saisie → Services validation → Algorithmes calcul → Règles métier → Rapport final
```

#### Du Diagnostic aux Traitements

```
Classification → Protocole phase → Traitements → Monitoring → Transition
     ↓
MAS sévère → Phase 1 F75 → Antibiotiques → Pesées quotidiennes → Critères transition
```

#### Du Suivi aux Interventions

```
Rappels → Consultations → Évaluations → Ajustements → Nouveaux rappels
     ↓
Rappel J+7 → Consultation → Réévaluation → Changement phase → Rappels adaptés
```

### États et Transitions du Patient

#### États Anthropométriques

```
Normal → Risque → Modéré → Sévère → Récupération → Normal
   ↓        ↓        ↓        ↓         ↓           ↓
Z -2/+2  Z -2/-3  Z -3/-4   Z <-4    Amélioration  Z -2/+2
```

#### États des Phases de Soin

```
Admission → Phase 1 → Transition → Phase 2 → Sortie → Suivi post-traitement
     ↓         ↓         ↓         ↓        ↓            ↓
Critères   Protocole  Amélioration Protocole Guérison  Rappels espacés
d'entrée    aiguë      clinique     réhab     critères
```

### Règles Métier Interconnectées

#### Sécurité Alimentaire

- **F75**: ≤ 130 kcal/100ml, dilution stricte, pas de mélange
- **F100**: ≤ 100 kcal/100ml, administration contrôlée, surveillance glycémie
- **Fréquences**: Max 8 prises/jour pour F100, ajustement selon tolérance

#### Critères de Transition

- **Phase 1 → Transition**: Gain pondéral ≥ 5g/kg/jour + disparition œdème
- **Transition → Phase 2**: Stabilité clinique + poursuite récupération
- **Phase 2 → Sortie**: Z-score WFH > -2 + éducation familiale complète

#### Gestion des Complications

- **Infections**: Amoxicilline systématique + surveillance température
- **Œdème**: Restriction hydrique + diurétiques + surveillance ionique
- **Dénutrition sévère**: Apports progressifs + correction métabolique

### Interfaces Utilisateur Connectées

#### Navigation Contextuelle

- **Depuis patient**: Accès direct évaluations, diagnostics, rappels
- **Depuis diagnostic**: Liens vers protocoles, monitoring, exports
- **Depuis rappels**: Navigation vers patients concernés, actions requises

#### Synchronisation des États

- **Modification données**: Recalcul automatique indicateurs affectés
- **Changement phase**: Mise à jour protocoles, rappels, monitoring
- **Nouveau diagnostic**: Ajustement plan de soin, alertes équipe

#### Feedback Visuel Intégré

- **Code couleur**: Rouge=urgence, Jaune=attention, Vert=normal
- **Icônes contextuelles**: Symptômes, traitements, phases
- **Badges**: Statuts patient, urgences, actions requises

Cette analyse détaillée des workflows et connexions permet au designer UI/UX de comprendre comment chaque fonctionnalité s'intègre dans l'écosystème global de l'application et comment concevoir des interfaces qui respectent la logique métier complexe tout en offrant une expérience utilisateur fluide et intuitive.

## 🎨 Spécifications de Précision pour l'Interface Utilisateur

### Product Requirement: AI SaaS Software - Homepage

#### 🎯 **Purpose (Objectif)**

Fournir aux utilisateurs un aperçu engageant et informatif de nos offres logicielles IA, mettant en valeur les fonctionnalités et avantages pour encourager l'exploration et l'engagement.

#### 🧩 **UI Components (Composants Interface)**

**Navigation Bar (Barre de Navigation)**

- Navigation globale pour les sections produit
- Liens vers : fonctionnalités, tarification, contact
- Position : En-tête fixe
- Style : Minimaliste avec focus sur l'utilisabilité

**Hero Section (Section Principale)**

- Zone de fonctionnalité prominente
- Contenu : Titre principal, sous-titre, bouton d'appel à l'action
- Layout : Centré, visuellement impactant
- Call-to-action : Bouton principal avec contraste élevé

**Feature Highlights (Points Forts des Fonctionnalités)**

- Présentation : Grille ou liste des fonctionnalités clés
- Éléments : Icônes + descriptions brèves
- Organisation : 3-4 fonctionnalités par ligne sur desktop
- Interaction : Hover effects et animations subtiles

**Testimonials (Témoignages)**

- Format : Carousel ou vue liste
- Contenu : Avis clients + notations
- Design : Cards avec photos et citations
- Navigation : Contrôles accessibles et indicateurs

**Footer (Pied de Page)**

- Liens supplémentaires, informations de contact, icônes réseaux sociaux
- Organisation : Sections logiques avec hiérarchie claire
- Accessibilité : Liens correctement structurés

#### 🎨 **Visual Style (Style Visuel)**

**Theme (Thème)**

- **Principal** : Thème clair avec mode sombre optionnel
- **Accessibilité** : Contraste élevé pour lisibilité optimale
- **Cohérence** : Application uniforme sur tous les composants

**Color Palette (Palette de Couleurs)**

```css
--primary: #6366f1; /* Indigo - Actions principales, CTA */
--secondary: #8b5cf6; /* Purple - Éléments secondaires, accents */
--accent: #06b6d4; /* Cyan - Highlights, éléments interactifs */
--error: #df3f40; /* Red - Alertes, erreurs, validations */
--background: #ffffff; /* Blanc - Fond principal */
--surface: #f8fafc; /* Gris très clair - Cards, sections */
--text-primary: #1e293b; /* Gris foncé - Texte principal */
--text-secondary: #64748b; /* Gris moyen - Texte secondaire */
--border: #e3e6ea; /* Gris clair - Bordures, séparateurs */
```

**Spacing (Espacement)**

- **Outer padding** : 20px constant sur tous les côtés
- **Gutter spacing** : 16px entre les éléments
- **Component spacing** : 24px entre sections majeures
- **Inner padding** : 16px pour les cards, 12px pour les boutons

**Borders & Corners (Bordures & Coins)**

- **Border width** : 1px solid pour cards et champs input
- **Border color** : #E3E6EA (gris clair)
- **Border radius** : 6px pour cohérence visuelle
- **Shadow** : Subtile elevation pour la profondeur (2-4px)

**Typography (Typographie)**

- **Font family** : Sans-serif system (Inter, Roboto, -apple-system)
- **Font weights** :
  - Headings : 500 (medium) - Titres et sous-titres
  - Body : 400 (regular) - Texte principal
  - Emphasis : 600 (semi-bold) - Labels importants
- **Font sizes** :
  - H1 : 48px (desktop), 32px (mobile)
  - H2 : 36px (desktop), 24px (mobile)
  - H3 : 24px (desktop), 20px (mobile)
  - Body large : 18px
  - Body : 16px (base)
  - Body small : 14px
  - Caption : 12px
- **Line heights** : 1.5 pour lisibilité optimale

**Icons & Images (Icônes & Images)**

- **Icons** : Vecteurs simples, remplis, cohérents
  - Navigation : 20x20px
  - Actions : 16x16px
  - États : 14x14px
- **Images** : Style plat illustratif
  - Usage : États vides, sections décoratives
  - Format : SVG/WebP pour optimisation
  - Ratio : Cohérent selon usage

#### 📱 **Responsive Design (Design Adaptatif)**

**Breakpoints**

- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

**Layout Adaptations**

- **Mobile-first** : Design optimisé pour mobile, enhancement progressif
- **Grid system** : 12 colonnes flexibles
- **Container widths** :
  - Mobile : 100% - 20px padding
  - Tablet : 720px max-width
  - Desktop : 1200px max-width

#### ♿ **Accessibility (Accessibilité)**

**Standards Respectés**

- **WCAG 2.1 AA** : Conformité niveau AA
- **Color contrast** : Ratio minimum 4.5:1 pour texte normal
- **Focus indicators** : Visibles et cohérents
- **Keyboard navigation** : Support complet sans souris
- **Screen readers** : Labels et descriptions appropriés

**Features Spécifiques**

- **Alt texts** : Descriptions complètes pour toutes les images
- **ARIA labels** : Attributs pour éléments interactifs complexes
- **Skip links** : Navigation rapide vers contenu principal
- **Error messages** : Descriptions claires et suggestions d'action

#### 🎭 **Animations & Interactions**

**Micro-interactions**

- **Hover states** : Changements subtils de couleur/opacité
- **Button interactions** : Scale léger (1.02x) + shadow
- **Form fields** : Focus rings avec transition smooth
- **Loading states** : Skeletons et spinners cohérents

**Transitions**

- **Duration** : 200-300ms pour fluidité
- **Easing** : Cubic-bezier pour naturel
- **Entrance animations** : Fade-in stagger pour les listes
- **Exit animations** : Scale-down pour les modals

#### 🛠️ **Technical Implementation (Implémentation Technique)**

**CSS Architecture**

- **Methodology** : BEM (Block Element Modifier)
- **Variables** : CSS custom properties pour thème
- **Responsive** : Mobile-first avec media queries
- **Performance** : CSS optimisé, critique en ligne

**Component Structure**

- **Atomic design** : Atoms → Molecules → Organisms
- **Reusable components** : Bibliothèque partagée
- **State management** : Props et context pour thème
- **Testing** : Tests visuels et d'accessibilité

Cette spécification de précision fournit au designer UI/UX tous les détails nécessaires pour créer une interface utilisateur cohérente, accessible et engageante qui respecte les standards de qualité élevés attendus pour un produit SaaS AI professionnel.

## Rôles Utilisateur Identifiés

### Professionnel de Santé (Utilisateur Principal)

- **Permissions détectées**:
  - Création/lecture/modification de patients
  - Accès aux données médicales confidentielles
  - Génération de diagnostics
  - Export de données patient
- **Actions possibles**:
  - Gestion complète du cycle patient
  - Utilisation des outils de diagnostic
  - Accès aux courbes de croissance
  - Programmation de rappels
- **Restrictions identifiées**:
  - Authentification obligatoire
  - Données chiffrées localement
- **Besoins fonctionnels dérivés**:
  - Interface intuitive pour saisie rapide
  - Accès hors-ligne aux données
  - Synchronisation sécurisée

## Parcours Utilisateur Principaux

### Parcours d'Onboarding

1. **Étape**: Lancement de l'application
   - Affichage du logo et splash screen
   - Redirection automatique selon statut authentification
2. **Étape**: Écran d'accueil (si non connecté)
   - Carrousel explicatif (3 écrans)
   - Boutons "Suivant/Passer"
3. **Étape**: Connexion Google
   - Authentification sécurisée
   - Gestion des erreurs de connexion
4. **Étape**: Initialisation (première utilisation)
   - Configuration de la base de données
   - Import de données de référence

- **Points d'interaction**: Swipe, boutons, Google Sign-In
- **Données échangées**: Tokens d'authentification, préférences utilisateur
- **États possibles**: Succès (accès home), Erreur (retry), Chargement (spinner)
- **Opportunités d'optimisation UX**: Réduction du nombre d'écrans d'onboarding

### Parcours de Gestion Patient

1. **Étape**: Accès à la liste patients (home)
   - Recherche par nom
   - Tri par date de création
2. **Étape**: Création nouveau patient
   - Formulaire multi-étapes avec validation
   - Sauvegarde automatique en brouillon
3. **Étape**: Consultation dossier patient
   - Vue d'ensemble des informations
   - Accès aux évaluations précédentes
4. **Étape**: Nouvelle évaluation
   - Saisie des mesures anthropométriques
   - Sélection des signes cliniques
   - Génération du diagnostic

- **Points d'interaction**: Recherche, formulaires, boutons d'action
- **Données échangées**: Données patient, mesures médicales, diagnostics
- **États possibles**: Succès (sauvegarde), Erreur (validation), Chargement (calculs)
- **Opportunités d'optimisation UX**: Simplification des formulaires longs

### Parcours de Diagnostic

1. **Étape**: Saisie des données
   - Interface de saisie optimisée
   - Validation en temps réel
2. **Étape**: Calcul automatique
   - Traitement des données selon algorithmes médicaux
   - Calcul des Z-scores
3. **Étape**: Affichage des résultats
   - Rapport détaillé avec interprétation
   - Recommandations de traitement
4. **Étape**: Export/Partage
   - Génération de PDF
   - Partage sécurisé

- **Points d'interaction**: Formulaires, boutons de calcul, exports
- **Données échangées**: Mesures brutes, scores calculés, rapports
- **États possibles**: Succès (diagnostic généré), Erreur (données insuffisantes)
- **Opportunités d'optimisation UX**: Visualisation graphique des résultats

## Structure Informationnelle

### Hiérarchie des Pages/Vues Détectées

```
📱 Application Root
├── 🔐 Onboarding (4 écrans carrousel)
├── 🏠 Home (Écran principal)
│   ├── 👤 Gestion Patients
│   ├── 📊 Courbes de Croissance
│   ├── 🔔 Rappels
│   └── ⚙️ Paramètres
├── 👶 [PatientID] (Détail patient)
│   ├── 📋 Informations générales
│   ├── 📈 Évaluations
│   └── 📄 Dossier médical
├── 📊 Growth Chart (Visualisation)
├── 📋 Table Detail (Données tabulaires)
├── 📄 PDF Viewer (Rapports)
└── 🛠️ Tools (Outils calculateurs)
```

### Navigation Identifiée

- **Navigation par onglets**: Home avec sous-sections (Patients, Rappels, Paramètres)
- **Navigation stack**: Détails patient, formulaires d'évaluation
- **Navigation modale**: Onboarding, paramètres, exports

### Regroupements Logiques des Fonctionnalités

- **Gestion Patient**: Création, consultation, modification
- **Évaluation**: Saisie données, calculs, diagnostics
- **Outils**: Calculateurs, visualisations, exports
- **Administration**: Paramètres, synchronisation, sauvegarde

### Suggestions de Restructuration

- Regrouper les fonctionnalités d'évaluation dans un flux dédié
- Simplifier la navigation entre patients et évaluations
- Créer des raccourcis pour les actions fréquentes

## Analyse des Gaps et Opportunités

### Problèmes Identifiés

#### Fonctionnalités Incomplètes

- Moteur de diagnostic: Logique présente mais interface incomplète
- Gestion des rappels: Infrastructure présente mais UI limitée
- Import/Export: Utilitaires développés mais intégration partielle
- Synchronisation: Non implémentée

#### Incohérences UX Détectées

- Onboarding trop long (4 écrans) pour une app médicale
- Formulaires de saisie trop complexes pour utilisation mobile
- Navigation non optimisée pour workflow médical

#### Manques Fonctionnels

- Mode hors-ligne complet
- Synchronisation multi-appareils
- Sauvegarde cloud sécurisée
- Intégration avec PACS/DMP

### Recommandations Stratégiques

#### Améliorations Prioritaires

1. **Finaliser le moteur de diagnostic** (Critique)
2. **Optimiser l'UX des formulaires** (Haute)
3. **Implémenter la synchronisation** (Haute)
4. **Compléter les exports PDF** (Moyenne)

#### Nouvelles Fonctionnalités Suggérées

- **Dashboard analytique**: Statistiques sur les patients
- **Modèles de rapport**: Templates personnalisables
- **Intégration télémédecine**: Consultation à distance
- **API pour intégrations**: Connexion avec autres systèmes

#### Optimisations UX Recommandées

- Réduire l'onboarding à 2 écrans maximum
- Implémenter la saisie vocale pour les mesures
- Ajouter des raccourcis clavier sur tablette
- Optimiser pour usage en conditions de terrain (faible connectivité)

---

_Document généré automatiquement par analyse de la codebase NutriPed_
_Date: 07/09/2025_
_Version codebase: 80d6c22a62c283042ee73e80094afadb8ff2b06b_
