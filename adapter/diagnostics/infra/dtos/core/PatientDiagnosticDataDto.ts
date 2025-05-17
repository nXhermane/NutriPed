import { EdemaData } from "@core/diagnostics";
import { Sex } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";


export interface PatientDiagnosticDataPersistenceDto extends EntityPersistenceDto {
   sex: `${Sex}`;
   birthday: string;
   anthropMeasures: {
      code: string;
      value: number;
      unit: string;
   }[];
   clinicalSigns: {
      edema: { code: string; data: EdemaData };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      otherSigns: { code: string; data: Record<string, any> }[];
   };
   biologicalTestResults: { code: string; value: number; unit: string }[];
}
