import {
  NutritionalRiskFactor,
  NutritionalRiskFactorRepository,
} from "@/core/evaluation";
import { SystemCode } from "@shared";
import { EntityBaseRepositoryWeb } from "../../../../shared";
import { NutritionalRiskFactorPersistenceDto } from "../../dtos";

export class NutritionalRiskFactorRepoWebImpl
  extends EntityBaseRepositoryWeb<
    NutritionalRiskFactor,
    NutritionalRiskFactorPersistenceDto
  >
  implements NutritionalRiskFactorRepository
{
  protected storeName: string = "nutritional_risk_factors";

  async getByClinicalRefCode(
    code: SystemCode
  ): Promise<NutritionalRiskFactor[]> {
    try {
      const store = await this.getObjectStore();

      return new Promise((resolve, reject) => {
        const request = store.index("clinicalSignCode").getAll(code.unpack());

        request.onsuccess = event => {
          const results = (event.target as IDBRequest).result;
          if (!results || results.length === 0) {
            resolve([]);
            return;
          }

          const riskFactors = results.map(
            (dto: NutritionalRiskFactorPersistenceDto) =>
              this.mapper.toDomain(dto)
          );
          resolve(riskFactors);
        };

        request.onerror = event => {
          console.error("Error fetching nutritional risk factors:", event);
          reject(
            new Error(
              `Failed to fetch nutritional risk factors for code ${code.unpack()}`
            )
          );
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(
        `Failed to get nutritional risk factors by clinical code: ${error}`
      );
    }
  }
}
