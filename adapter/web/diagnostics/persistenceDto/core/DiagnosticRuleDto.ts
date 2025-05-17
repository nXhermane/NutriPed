import { ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../common";

export interface DiagnosticRulePersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   conditions: ICondition[];
}
