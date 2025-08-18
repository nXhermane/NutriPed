import { ClinicalDataType } from "@core/constants";
import { ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";
import { ClinicalSignDataDto } from "@/core/evaluation";

export interface ClinicalSignReferencePersistenceDto
  extends EntityPersistenceDto {
  name: string;
  code: string;
  description: string;
  evaluationRule: ICondition;
  data: ClinicalSignDataDto[];
}
