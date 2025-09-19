import { BiochemicalRange } from "./BiochemicalRange";

export interface BiochemicalReference {
  name: string;
  code: string;
  unit: string;
  availableUnits: string[];
  ranges: BiochemicalRange[];
  source: string;
  notes?: string[];
}
