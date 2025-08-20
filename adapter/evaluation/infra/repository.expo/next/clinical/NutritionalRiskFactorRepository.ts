import {
  EntityBaseRepositoryExpo,
  RepositoryException,
} from "@/adapter/shared";
import { NextClinicalDomain } from "@/core/evaluation";
import { NextClinicalInfraDtos } from "../../../dtos";
import { nutritional_risk_factors } from "../../db";
import { SystemCode } from "@/core/shared";
import { eq } from "drizzle-orm";

export class NutritionalRiskFactorRepositoryExpoImpl
  extends EntityBaseRepositoryExpo<
    NextClinicalDomain.NutritionalRiskFactor,
    NextClinicalInfraDtos.NutritionalRiskFactorPersistenceDto,
    typeof nutritional_risk_factors
  >
  implements NextClinicalDomain.NutritionalRiskFactorRepository
{
  async getByClinicalRefCode(
    code: SystemCode
  ): Promise<NextClinicalDomain.NutritionalRiskFactor[]> {
    try {
      const entityPersistenceTypes = (await this.db
        .select()
        .from(this.table)
        .where(eq(this.table.clinicalSignCode, code.unpack()))
        .all()) as NextClinicalInfraDtos.NutritionalRiskFactorPersistenceDto[];
      return entityPersistenceTypes.map(entity => this.mapper.toDomain(entity));
    } catch (e: unknown) {
      throw new RepositoryException(
        `Repository getting all internal error`,
        e as Error
      );
    }
  }
}
