import {
  NutritionalRiskFactor,
  NutritionalRiskFactorRepository,
} from "@core/diagnostics";
import {
  EntityBaseRepositoryExpo,
  RepositoryException,
} from "../../../../shared";
import { NutritionalRiskFactorPersistenceDto } from "../..";
import { nutritional_risk_factors } from "../db";
import { SystemCode } from "@shared";
import { eq } from "drizzle-orm";

export class NutritionalRiskFactorRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    NutritionalRiskFactor,
    NutritionalRiskFactorPersistenceDto,
    typeof nutritional_risk_factors
  >
  implements NutritionalRiskFactorRepository
{
  async getByClinicalRefCode(
    code: SystemCode
  ): Promise<NutritionalRiskFactor[]> {
    try {
      const entityPersistenceTypes = (await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.clinicalSignCode, code.unpack()))
        .all()) as NutritionalRiskFactorPersistenceDto[];
      return entityPersistenceTypes.map(this.mapper.toDomain);
    } catch (e: unknown) {
      throw new RepositoryException(
        `Repository getting all internal error`,
        e as Error
      );
    }
  }
}
