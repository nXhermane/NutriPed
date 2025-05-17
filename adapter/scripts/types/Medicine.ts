export enum MedicineCategory {
  ANTIBACTERIALS = "antibacterials",
  ANTIFUNGALS = "antifungals",
  ANTIMALARIALS = "antimalarials",
  SCABIES = "scabies",
  CARDIAC_FAILURE = "cardiac_failure",
  ALTERNATIVES = "alternatives",
}

export enum AdministrationRoute {
  ORAL = "oral",
  IV = "iv",
  IM = "im",
  IV_IM = "iv/im",
  RECTAL = "rectal",
  TOPICAL = "topical",
  ORAL_IV = "oral/iv",
  ORAL_IM = "oral/im",
}

export enum DosageUnit {
  MG = "mg",
  MG_KG = "mg/kg",
  MG_KG_DAY = "mg/kg/day",
  UI = "UI",
  ML = "ml",
  G = "g",
}

export type Amount =
  | { value: number; unit: DosageUnit }
  | { minValue: number; maxValue: number; unit: DosageUnit };

export interface WeightRange {
  min: number;
  max: number; // Use Infinity as a number if needed.
  description: string;
}

export interface BaseDosage {
  label: string;
  frequency: number;
  min: number;
  max: number;
  unit: DosageUnit;
}

export interface DosageRange {
  weightRange: WeightRange;
  // Some entries use the key "amount" others "dosageAmount".
  // Here we create a unified property.
  amount: Amount;
  frequency: number;
}

export interface Medicine {
  code: string;
  name: string;
  category: MedicineCategory;
  administrationRoutes: AdministrationRoute[];
  baseDosage: BaseDosage;
  dosageRanges: DosageRange[];
  warnings?: string[];
  contraindications?: string[];
  interactions?: string[];
  notes?: string[];
}
