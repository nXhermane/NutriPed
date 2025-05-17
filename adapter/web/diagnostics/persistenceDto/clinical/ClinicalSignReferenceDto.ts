import { ClinicalDataType } from "@core/constants";
import { ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../common";

export interface ClinicalSignReferencePersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   description: string;
   evaluationRule: ICondition;
   data: {
      name: string;
      code: string;
      question: string;
      dataType: ClinicalDataType;
      required: boolean;
      dataRange?: [number, number];
      enumValue?: string[];
   }[]
}
