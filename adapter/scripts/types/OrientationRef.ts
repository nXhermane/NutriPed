import { ICondition } from "@shared";

export interface OrientationRef {
  name: string;
  code: string;
  admissionCriteria: ICondition[];
  admissionTypes: { name: string; code: string; condition: ICondition }[];
}
