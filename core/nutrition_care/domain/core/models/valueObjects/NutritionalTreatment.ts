import {
  ValueObject,
  Guard,
  ArgumentInvalidException,
  Result,
  handleError,
  formatError,
} from "@shared";

export interface INutritionalTreatment {
  caloricIntake: number; // kcal/kg/day
  proteinIntake: number; // g/kg/day
  lipidIntake: number; // g/kg/day
  carbohydrateIntake: number; // g/kg/day
  fluidIntake: number; // ml/kg/day
  feedingFrequency: number; // times per day
  feedingMethod: FeedingMethod;
  specialRestrictions: string[];
  nutritionalObjectives: NutritionalObjective[];
  duration: number; // days
  notes: string;
}

export enum FeedingMethod {
  ORAL = "oral",
  NASOGASTRIC = "nasogastric",
  GASTROSTOMY = "gastrostomy",
  PARENTERAL = "parenteral",
  MIXED = "mixed"
}

export interface NutritionalObjective {
  parameter: string; // e.g., "weight_gain", "protein_status"
  targetValue: number;
  unit: string;
  timeframe: number; // days
}

export class NutritionalTreatment extends ValueObject<INutritionalTreatment> {
  protected validate(props: Readonly<INutritionalTreatment>): void {
    if (Guard.isNegativeOrZero(props.caloricIntake).succeeded) {
      throw new ArgumentInvalidException("Caloric intake must be positive");
    }
    if (Guard.isNegativeOrZero(props.proteinIntake).succeeded) {
      throw new ArgumentInvalidException("Protein intake must be positive");
    }
    if (Guard.isNegativeOrZero(props.feedingFrequency).succeeded) {
      throw new ArgumentInvalidException("Feeding frequency must be positive");
    }
    if (Guard.isNegativeOrZero(props.duration).succeeded) {
      throw new ArgumentInvalidException("Duration must be positive");
    }
  }

  get caloricIntake(): number {
    return this.props.caloricIntake;
  }

  get proteinIntake(): number {
    return this.props.proteinIntake;
  }

  get feedingMethod(): FeedingMethod {
    return this.props.feedingMethod;
  }

  get nutritionalObjectives(): NutritionalObjective[] {
    return this.props.nutritionalObjectives;
  }

  get duration(): number {
    return this.props.duration;
  }

  // Calculate total daily calories for a given weight
  calculateDailyCalories(weightKg: number): number {
    return this.props.caloricIntake * weightKg;
  }

  // Calculate total daily protein for a given weight
  calculateDailyProtein(weightKg: number): number {
    return this.props.proteinIntake * weightKg;
  }

  // Check if nutritional objectives are compatible
  hasCompatibleObjectives(): boolean {
    const objectiveParameters = this.props.nutritionalObjectives.map(obj => obj.parameter);
    const uniqueParameters = new Set(objectiveParameters);
    return objectiveParameters.length === uniqueParameters.size;
  }

  static create(props: INutritionalTreatment): Result<NutritionalTreatment> {
    try {
      return Result.ok(new NutritionalTreatment(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
