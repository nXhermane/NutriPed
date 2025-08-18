import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared";
import { DataFieldReference, DataFieldReferenceRepository } from "@/core/evaluation";
import { DataFieldReferencePersistenceDto } from "../../dtos";
import { data_field_references } from "../db";

export class DataFieldRepositoryExpoImpl extends EntityBaseRepositoryExpoWithCodeColumn<DataFieldReference, DataFieldReferencePersistenceDto, typeof data_field_references> implements DataFieldReferenceRepository {

}