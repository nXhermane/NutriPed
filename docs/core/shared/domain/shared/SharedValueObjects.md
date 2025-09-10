# Shared Value Objects

**Dossier Source:** `core/shared/domain/shared/valueObjects/`

## 1. Vue d'Ensemble

Ce dossier contient une collection de [ValueObjects](../common/ValueObject.md) qui sont utilisés par plusieurs modules (Bounded Contexts) de l'application. Ce sont des concepts de domaine si fondamentaux et universels (comme une date, un nom, ou un genre) qu'il est logique de les définir à un seul endroit pour garantir la cohérence et la réutilisation du code.

Chaque Value Object encapsule ses propres règles de validation, s'assurant que les données qu'il représente sont toujours dans un état valide.

## 2. Liste des Value Objects Partagés

| Classe           | Description                                                                 | Type de Donnée               |
| ---------------- | --------------------------------------------------------------------------- | ---------------------------- |
| `Address`        | Représente une adresse physique.                                            | `string`                     |
| `BirthDay`       | Représente une date de naissance, avec des validations spécifiques.         | `string` (date)              |
| `Condition`      | Représente une condition (règle) avec un champ, un opérateur et une valeur. | `{ field, operator, value }` |
| `Contact`        | Représente des informations de contact (email, téléphone).                  | `{ email, phone }`           |
| `Criterion`      | Représente un critère de décision ou de filtrage.                           | `{ name, value, operator }`  |
| `Date`           | Représente une date (jour, mois, année).                                    | `Date` (objet natif)         |
| `DateFrame`      | Représente une période avec une date de début et de fin.                    | `{ start, end }`             |
| `DateTime`       | Représente une date et une heure.                                           | `string` (datetime)          |
| `DomainDateTime` | Représente une date et une heure avec une logique de domaine riche.         | `Date` (objet natif)         |
| `Duration`       | Représente une durée (ex: 7 jours).                                         | `{ type, value }`            |
| `Email`          | Représente une adresse email et valide son format.                          | `string`                     |
| `Formula`        | Représente une formule mathématique ou logique.                             | `string`                     |
| `FullName`       | Représente un nom complet et permet d'en extraire le prénom/nom.            | `string`                     |
| `Gender`         | Représente le genre (ex: 'Male', 'Female').                                 | `string`                     |
| `PhoneNumber`    | Représente un numéro de téléphone et valide son format.                     | `string`                     |
| `SystemCode`     | Représente un code système standardisé.                                     | `string`                     |
| `Time`           | Représente une heure (heures, minutes).                                     | `string`                     |
| `UnitCode`       | Représente un code d'unité de mesure (ex: 'kg', 'cm').                      | `string`                     |

## 3. Exemples Détaillés

Voici le code source de deux de ces Value Objects pour illustrer comment ils sont implémentés.

### Exemple 1 : `Email` (Value Object simple, basé sur une primitive)

`Email.ts` est un exemple parfait de Value Object qui encapsule une seule valeur (`string`) et lui ajoute une logique de validation.

**Fichier Source:** `core/shared/domain/shared/valueObjects/Email.ts`

```typescript
import { ValueObject, ValueObjectProps } from "./../../common";
import { InvalidArgumentFormatError, handleError } from "./../../../exceptions";
import { Result } from "./../../../core";

export class Email extends ValueObject<string> {
  private static isValidEmailFormat(value: string): boolean {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(value);
  }

  protected validate(props: ValueObjectProps<string>): void {
    if (!Email.isValidEmailFormat(props._value)) {
      throw new InvalidArgumentFormatError(
        "The email must be in a valid format."
      );
    }
  }

  public static create(value: string): Result<Email> {
    try {
      const email = new Email({ _value: value });
      return Result.ok<Email>(email);
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  public toString(): string {
    return this.props._value;
  }
}
```

**Logique clé :** La méthode `validate` utilise une expression régulière pour s'assurer que la chaîne de caractères fournie correspond bien à un format d'email valide avant de permettre la création de l'objet.

---

### Exemple 2 : `FullName` (Value Object avec logique métier)

`FullName.ts` montre comment un Value Object peut non seulement valider des données, mais aussi encapsuler une logique métier utile. Il est stocké comme une seule chaîne, mais fournit des `getters` pour accéder facilement au prénom et au nom de famille.

**Fichier Source:** `core/shared/domain/shared/valueObjects/FullName.ts`

```typescript
import { ValueObject } from "../../common";
import { Guard, Result } from "../../../core";
import { EmptyStringError, handleError } from "../../../exceptions";

export class FullName extends ValueObject<string> {
  constructor(nom: string) {
    super({ _value: nom });
  }

  protected validate(props: { _value: string }): void {
    if (Guard.isEmpty(props._value).succeeded) {
      throw new EmptyStringError("The name must be empty.");
    }
    //TODO: Add a rule to control name length
  }

  get lastName(): string {
    const parts = this.props._value.trim().split(" ");
    return parts[parts.length - 1];
  }

  get firstName(): string {
    return this.props._value.trim().split(" ")[0];
  }

  get fullName(): string {
    return this.props._value;
  }

  public toString(): string {
    return this.props._value;
  }

  public static create(nom: string): Result<FullName> {
    try {
      const name = new FullName(nom);
      return Result.ok<FullName>(name);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
```

**Logique clé :** Les `getters` `lastName` et `firstName` contiennent la logique pour découper la chaîne de caractères du nom complet. Si cette logique devait changer (par exemple, pour gérer les noms composés), la modification ne devrait être faite qu'à un seul endroit : à l'intérieur de ce Value Object.
