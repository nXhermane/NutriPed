import { EntityBaseRepositoryWeb } from "@/adapter/shared";
import { FormulaFieldReference } from "@/core/evaluation";
import { FormulaFieldReferencePersistenceDto } from "../../dtos";
import { SystemCode } from "@/core/shared";

export class FormulaFieldReferenceRepositoryWebImpl extends EntityBaseRepositoryWeb<
  FormulaFieldReference,
  FormulaFieldReferencePersistenceDto
> {
  protected storeName = "formula_field_references";
  async getByCode(code: SystemCode): Promise<FormulaFieldReference> {
    try {
      const store = await this.getObjectStore();
      return new Promise((resolve, reject) => {
        const request = store.index("code").get(code.unpack());

        request.onsuccess = event => {
          const result = (event.target as IDBRequest).result;
          if (!result) {
            reject(new Error("Entity Not found"));
            return;
          }
          resolve(this.mapper.toDomain(result as FormulaFieldReferencePersistenceDto));
        };

        request.onerror = event => {
          console.error("Error fetching by code:", event);
          reject(new Error("Failed to fetch entity"));
        };
      });
    } catch (error) {
      console.error(error);
      throw new Error(error as string);
    }
  }
}
