import {
  ValueObject,
  Guard,
  ArgumentInvalidException,
  Result,
  handleError,
} from "@shared";

export interface ISystematicTreatment {
  medications: MedicationProtocol[];
  supplements: SupplementProtocol[];
  specialCare: SpecialCareProtocol[];
  duration: number; // days
  notes: string;
}

export interface MedicationProtocol {
  medicationId: string;
  dosage: number;
  unit: string; // mg, ml, etc.
  frequency: number; // times per day
  route: AdministrationRoute;
  conditions: string[]; // conditions for administration
  duration: number; // days
}

export interface SupplementProtocol {
  supplementName: string;
  dosage: number;
  unit: string;
  frequency: number;
  withMeals: boolean;
  duration: number;
}

export interface SpecialCareProtocol {
  careType: SpecialCareType;
  frequency: number; // times per day
  duration: number; // minutes per session
  instructions: string;
}

export enum AdministrationRoute {
  ORAL = "oral",
  INTRAMUSCULAR = "intramuscular",
  INTRAVENOUS = "intravenous",
  SUBCUTANEOUS = "subcutaneous",
  TOPICAL = "topical"
}

export enum SpecialCareType {
  PHYSIOTHERAPY = "physiotherapy",
  OCCUPATIONAL_THERAPY = "occupational_therapy",
  SPEECH_THERAPY = "speech_therapy",
  PSYCHOLOGICAL_SUPPORT = "psychological_support",
  WOUND_CARE = "wound_care"
}

export class SystematicTreatment extends ValueObject<ISystematicTreatment> {
  protected validate(props: Readonly<ISystematicTreatment>): void {
    if (Guard.isNegativeOrZero(props.duration).succeeded) {
      throw new ArgumentInvalidException("Duration must be positive");
    }

    // Validate medications
    props.medications.forEach((med, index) => {
      if (Guard.isNegativeOrZero(med.dosage).succeeded) {
        throw new ArgumentInvalidException(`Medication ${index}: dosage must be positive`);
      }
      if (Guard.isNegativeOrZero(med.frequency).succeeded) {
        throw new ArgumentInvalidException(`Medication ${index}: frequency must be positive`);
      }
    });

    // Validate supplements
    props.supplements.forEach((supp, index) => {
      if (Guard.isNegativeOrZero(supp.dosage).succeeded) {
        throw new ArgumentInvalidException(`Supplement ${index}: dosage must be positive`);
      }
      if (Guard.isNegativeOrZero(supp.frequency).succeeded) {
        throw new ArgumentInvalidException(`Supplement ${index}: frequency must be positive`);
      }
    });
  }

  get medications(): MedicationProtocol[] {
    return this.props.medications;
  }

  get supplements(): SupplementProtocol[] {
    return this.props.supplements;
  }

  get specialCare(): SpecialCareProtocol[] {
    return this.props.specialCare;
  }

  get duration(): number {
    return this.props.duration;
  }

  // Get all medications for a specific route
  getMedicationsByRoute(route: AdministrationRoute): MedicationProtocol[] {
    return this.props.medications.filter(med => med.route === route);
  }

  // Calculate total daily medication doses
  getTotalDailyDoses(): { [medicationId: string]: number } {
    const totalDoses: { [medicationId: string]: number } = {};
    
    this.props.medications.forEach(med => {
      const dailyDose = med.dosage * med.frequency;
      totalDoses[med.medicationId] = (totalDoses[med.medicationId] || 0) + dailyDose;
    });

    return totalDoses;
  }

  // Check if treatment has any IV medications
  hasIntravenousMedications(): boolean {
    return this.props.medications.some(med => med.route === AdministrationRoute.INTRAVENOUS);
  }

  // Get treatment complexity score (simple heuristic)
  getComplexityScore(): number {
    const medicationScore = this.props.medications.length * 2;
    const supplementScore = this.props.supplements.length * 1;
    const specialCareScore = this.props.specialCare.length * 3;
    
    return medicationScore + supplementScore + specialCareScore;
  }

  static create(props: ISystematicTreatment): Result<SystematicTreatment> {
    try {
      return Result.ok(new SystematicTreatment(props));
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
