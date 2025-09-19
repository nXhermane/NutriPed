import { UnitCode } from "@shared";

export interface BiologicalUnitACL {
  convertTo(form: UnitCode, to: UnitCode, value: number): Promise<number>;
}
