import { EntityBaseRepositoryWeb } from "@/adapter/shared";
import { DataFieldReference } from "@/core/evaluation";
import { DataFieldReferencePersistenceDto } from "../../dtos";
import { SystemCode } from "@/core/shared";

export class DataFieldReferenceRepositoryWebImpl extends EntityBaseRepositoryWeb<
  DataFieldReference,
  DataFieldReferencePersistenceDto
> {
  protected storeName = "data_field_references";
  async getByCode(code: SystemCode): Promise<DataFieldReference> {
    throw new Error("Not Implemented Method");
  }
}
