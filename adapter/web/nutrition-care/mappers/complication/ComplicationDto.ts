import { EntityPersistenceDto } from "../../../common";

export interface ComplicationPersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   description: string;
}
