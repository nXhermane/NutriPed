import { GrowthStandard } from "@core/constants";
import { Sex } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";


export interface GrowthReferenceChartPersistenceDto extends EntityPersistenceDto {
   code: string;
   name: string;
   standard: `${GrowthStandard}`;
   sex: `${Sex}`;
   data: {
      value: number;
      median: number;
      l: number;
      s: number;
      curvePoints: Record<string, number>;
   }[];
}
