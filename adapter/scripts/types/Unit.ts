import { UnitType } from "@core/constants";


export interface UnitProps {
  name: string;
  code: string;
  conversionFactor: number;
  baseUnitCode: string;
  type: UnitType;
}
