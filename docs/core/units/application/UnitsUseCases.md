# Units Use Cases

**Dossier Source:** `core/units/application/useCases/`

## 1. Vue d'Ensemble

Les cas d'utilisation du module `Units` fournissent une API applicative pour la gestion des unités de mesure et pour l'exécution de conversions.

## 2. Cas d'Utilisation CRUD

La majorité des cas d'utilisation suivent un patron CRUD (Create, Read, Update, Delete) standard pour gérer les entités `Unit`. Ces cas d'utilisation sont probablement utilisés par un panneau d'administration pour permettre la configuration des unités disponibles dans l'application.

- **`Create`**: Crée une nouvelle définition d'unité (ex: "Milligramme", code "mg", type "Masse").
- **`Get`**: Récupère une ou plusieurs définitions d'unités.
- **`Update`**: Met à jour une définition d'unité existante.
- **`Delete`**: Supprime une définition d'unité.

## 3. Cas d'Utilisation `Convert`

C'est le cas d'utilisation le plus important de ce module du point de vue de la logique métier.

- **Dossier :** `Convert/`
- **Objectif :** Convertir une valeur numérique d'une unité à une autre.
- **Orchestration :**
  1.  Prend en entrée une valeur, une unité de départ (`fromUnitCode`) et une unité d'arrivée (`toUnitCode`).
  2.  Utilise le `UnitRepository` pour charger les instances complètes des agrégats `Unit` correspondant aux codes `fromUnitCode` et `toUnitCode`.
  3.  Instancie ou appelle le service de domaine `UnitConverterService`.
  4.  Passe la valeur et les deux instances `Unit` à la méthode `unitConverterService.convert(...)`.
  5.  Retourne le `Result` du service de conversion, qui contient soit la valeur convertie, soit une erreur si la conversion est impossible (par exemple, si les unités n'ont pas la même base).
