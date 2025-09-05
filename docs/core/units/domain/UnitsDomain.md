# Units Domain

**Dossier Source:** `core/units/domain/`

## 1. Vue d'Ensemble

Le domaine `Units` fournit un système de gestion et de conversion pour les **unités de mesure**. Dans une application médicale où les mesures (poids, taille, concentrations, etc.) sont omniprésentes, il est crucial d'avoir un système robuste pour garantir la cohérence et la correction des calculs.

Ce module est centré autour de l'agrégat `Unit` et du service de domaine `UnitConverterService`.

---

## 2. L'Agrégat `Unit`

L'entité `Unit` est la **Racine d'Agrégat** du module. Elle représente une unité de mesure spécifique.

### 2.1. Composition et Mécanisme de Conversion

La manière dont une `Unit` est modélisée est la clé de tout le système de conversion.

| Propriété | Type | Exemple | Description |
| --- | --- | --- | --- |
| `name` | `string` | `"Gramme"` | Le nom lisible de l'unité. |
| `code` | `SystemCode`| `"g"` | Le code système unique pour l'unité. |
| `type` | `UnitType` | `"Mass"` | La catégorie de mesure (Masse, Longueur, Volume, etc.). |
| `baseUnitCode` | `SystemCode`| `"kg"` | Le code de l'unité de **base** pour ce type de mesure. |
| `conversionFactor`| `number` | `0.001` | Le facteur pour convertir cette unité vers son unité de base. |

**Le mécanisme est le suivant :**
- Pour chaque type de mesure (Masse, Longueur...), une unité est désignée comme étant l'unité de **base**. Pour la masse, c'est le kilogramme (`kg`). Pour la longueur, ce pourrait être le mètre (`m`).
- Chaque autre unité de ce type définit son `conversionFactor` par rapport à cette unité de base.
- Exemple : Pour l'unité "Gramme" (`g`), le `baseUnitCode` est `"kg"` et le `conversionFactor` est `0.001`, car `1g = 0.001kg`.
- Pour l'unité de base elle-même (Kilogramme), son `baseUnitCode` serait `"kg"` et son `conversionFactor` serait `1`.

Ce modèle permet de convertir n'importe quelle unité vers n'importe quelle autre du même type, en passant par l'unité de base.

---

## 3. Le Service de Domaine `UnitConverterService`

Ce service contient la logique métier pour effectuer les conversions.

**Fichier Source:** `services/UnitConverterService.ts`
```typescript
export class UnitConverterService implements IUnitConverterService {
  convert(value: number, from: Unit, to: Unit): Result<number> {
    // ...
  }
}
```

### 3.1. Logique de la méthode `convert`

1.  **Validation :** La méthode vérifie d'abord que les deux unités (`from` et `to`) partagent le même `baseUnitCode`. Il est impossible de convertir des grammes en mètres. Si les bases sont différentes, elle retourne un `Result.fail`.
2.  **Conversion vers la Base :** Elle convertit la `value` initiale vers l'unité de base en utilisant le `conversionFactor` de l'unité `from`.
    `baseValue = value * from.getFactor()`
3.  **Conversion depuis la Base :** Elle convertit ensuite cette `baseValue` vers l'unité `to` en utilisant le `conversionFactor` de l'unité `to`.
    `finalValue = baseValue / to.getFactor()`
4.  **Retour :** Elle retourne un `Result.ok` avec la valeur finale.

Ce service simple mais puissant, combiné à la modélisation de l'agrégat `Unit`, fournit un système de conversion d'unités fiable et extensible pour toute l'application.
