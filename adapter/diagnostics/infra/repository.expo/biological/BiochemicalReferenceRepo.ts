import { BiochemicalReference, BiochemicalReferenceRepository } from "@core/diagnostics";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { BiochemicalReferencePersistenceDto } from "../..";
import { biochemical_references } from "../db";

export class BiochemicalReferenceRepositoryExpoImpl extends EntityBaseRepositoryExpoWithCodeColumn<BiochemicalReference,BiochemicalReferencePersistenceDto,typeof biochemical_references> implements BiochemicalReferenceRepository {}