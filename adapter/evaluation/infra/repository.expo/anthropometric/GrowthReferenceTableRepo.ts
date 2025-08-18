import {
  GrowthReferenceTable,
  GrowthReferenceTableRepository,
} from "@/core/evaluation";
import { EntityBaseRepositoryExpoWithCodeColumn } from "../../../../shared";
import { GrowthReferenceTablePersistenceDto } from "../..";
import { growth_reference_tables } from "../db";

export class GrowthReferenceTableRepositoryExpoImpl
  extends EntityBaseRepositoryExpoWithCodeColumn<
    GrowthReferenceTable,
    GrowthReferenceTablePersistenceDto,
    typeof growth_reference_tables
  >
  implements GrowthReferenceTableRepository {}
