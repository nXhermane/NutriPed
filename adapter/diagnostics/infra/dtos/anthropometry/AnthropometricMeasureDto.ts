import { EntityPersistenceDto } from "../../../../shared";


export interface AnthropometricMeasurePersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   validationRules: { condition: string; rule: string; variables: string[] }[];
   availableUnit: string[];
   unit: string;
}

