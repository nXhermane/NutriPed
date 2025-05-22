import { AdministrationRoute, Amount, IDosageRange } from "../../../domain";

export interface MedicineDosageResultDto {
  name: string;
  code: string;
  label: string;
  dailyDosage: Amount;
  dailyDosageFrequency: number;
  administrationRoutes: AdministrationRoute[];
  weightRangeDosage: IDosageRange;
}
