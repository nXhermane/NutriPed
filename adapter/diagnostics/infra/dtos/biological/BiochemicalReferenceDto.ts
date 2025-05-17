import { ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";


export interface BiochemicalReferencePersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   unit: string;
   availableUnits: string[];
   ranges: {
      condition: ICondition;
      range: {
         min: [value: number, notStrict: boolean];
         max: [value: number, notStrict: boolean];
      };
      under: string[];
      over: string[];
   }[];
   source: string;
   notes: string[];
}
