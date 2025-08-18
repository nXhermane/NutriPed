import { ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";

export interface DiagnosticRulePersistenceDto extends EntityPersistenceDto {
  name: string;
  code: string;
  conditions: ICondition[];
}
