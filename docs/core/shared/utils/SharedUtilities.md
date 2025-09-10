# Shared Utilities

**Dossier Source:** `core/shared/utils/`

## 1. Vue d'Ensemble

Ce dossier contient un ensemble de classes et de fonctions utilitaires, partagées et sans état (`stateless`), qui fournissent des fonctionnalités transversales. Elles ne font partie d'aucune couche architecturale spécifique (domaine, application, infrastructure) mais sont utilisées par plusieurs d'entre elles.

---

## 2. `DateManager`

**Fichier Source:** `DateManager.ts`

Une classe statique qui offre un ensemble de méthodes pour manipuler et formater les dates.

- **`formatDate(date: Date): string`**
  Formate un objet `Date` en une chaîne de caractères au format `YYYY-MM-DD`.

- **`formatTime(date: Date): string`**
  Formate un objet `Date` pour n'en extraire que l'heure et les minutes au format `HH:MM`.

- **`dateToDateTimeString(date: Date): string`**
  Convertit un objet `Date` en une chaîne de caractères complète au format `YYYY-MM-DD HH:MM:SS`.

- **`now(): number`**
  Retourne le timestamp actuel via `Date.now()`.

---

## 3. `SmartCal` Wrapper

**Fichier Source:** `SmartCal.ts`

Ce fichier est un "wrapper" qui intègre la bibliothèque externe **`smartcal`** dans l'application. Cette bibliothèque permet d'évaluer des expressions mathématiques ou logiques fournies sous forme de chaînes de caractères.

C'est un outil très puissant pour le domaine médical de l'application, car il permet de définir des règles cliniques ou des formules de calcul complexes sous une forme simple et stockable (une `string`).

**Fonctions Clés :**

- **`evaluateCondition(condition: string, obj?: object): any`**
  Évalue une expression (la `condition`). Le paramètre `obj` est un objet clé-valeur fournissant les variables à utiliser dans l'expression.

  _Exemple :_ `evaluateCondition("age > 5 && weight < 20", { age: 6, weight: 18 })` retournerait `true`.

- **`catchEvaluationError(callback: () => any): object`**
  Une fonction de plus haut niveau qui exécute un appel à `evaluateCondition` dans un bloc `try...catch` et retourne un objet de résultat structuré, permettant de gérer les erreurs de syntaxe dans la formule ou les variables manquantes.

- **`getResultFormCatchEvaluationResult(...)`**
  Traite le résultat de `catchEvaluationError` pour soit retourner la valeur calculée, soit lever une exception formatée en cas d'erreur.

---

## 4. `types.ts`

**Fichier Source:** `types.ts`

Ce fichier définit des alias de types TypeScript partagés.

- **`ValueType`**: Un type très large (`number | boolean | Date | object | string | null`) utilisé dans des contextes génériques où le type exact importe peu.

---

## 5. `zscore.ts`

**Fichier Source:** `zscore.ts`

Ce fichier est actuellement **vide**.

D'après son nom et le contexte de l'application (décrit dans le `README.md`), il était très probablement destiné à contenir la logique de calcul des **Z-Scores**, qui sont une mesure statistique fondamentale en pédiatrie pour évaluer la croissance d'un enfant par rapport à une population de référence.

La logique de calcul des Z-Scores est donc probablement située ailleurs dans le code (potentiellement via le wrapper `SmartCal`) ou n'a pas encore été implémentée dans ce fichier.
