import { FormulaFieldReferenceRepository } from "@/core/evaluation";
import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import { FormulaFieldReference } from "@/core/evaluation";
import { formula_field_references } from "../db/evaluation.schema";
import { FormulaFieldReferenceInfraMapper } from "../../mappers";
import { FormulaFieldReferencePersistenceDto } from "../../dtos";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

export class FormulaFieldReferenceExpoRepo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    FormulaFieldReference,
    FormulaFieldReferencePersistenceDto,
    typeof formula_field_references
  >
  implements FormulaFieldReferenceRepository
{
  constructor(
    db: ExpoSQLiteDatabase<Record<string, unknown>>,
    mapper: FormulaFieldReferenceInfraMapper
  ) {
    super(db, formula_field_references, mapper);
  }
  async getAll(): Promise<FormulaFieldReference[]> {
    const res = await this.db.select().from(this.table);
    return res.map(this.mapper.toDomain);
  }
}
