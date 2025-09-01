import { FormulaFieldReferenceRepository } from "@/core/evaluation";
import { EntityBaseRepository } from "@/adapter/shared";
import { FormulaFieldReference } from "@/core/evaluation";
import { formula_field_references } from "../db/evaluation.schema";
import { FormulaFieldReferenceInfraMapper } from "../../mappers";
import { FormulaFieldReferencePersistenceDto } from "../../dtos";
import { and, eq } from "drizzle-orm";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

export class FormulaFieldReferenceExpoRepo
  extends EntityBaseRepository<
    typeof formula_field_references,
    FormulaFieldReference,
    FormulaFieldReferencePersistenceDto,
    FormulaFieldReferenceInfraMapper
  >
  implements FormulaFieldReferenceRepository
{
  constructor(
    db: ExpoSQLiteDatabase<Record<string, unknown>>,
    mapper: FormulaFieldReferenceInfraMapper
  ) {
    super(db, formula_field_references, mapper);
  }
  async getByCode(code: string): Promise<FormulaFieldReference | null> {
    const res = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.code, code));
    if (res.length === 0) return null;
    return this.mapper.toDomain(res[0]);
  }
}
