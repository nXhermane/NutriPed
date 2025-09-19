import { EntityPersistenceDto } from "../../../../shared";

export interface ComplicationPersistenceDto extends EntityPersistenceDto {
  name: string;
  code: string;
  description: string;
}
