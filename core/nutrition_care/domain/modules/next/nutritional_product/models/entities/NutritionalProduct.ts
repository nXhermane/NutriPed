import { NUTRITIONAL_PRODUCT_CODE } from "@/core/constants";
import {
  AggregateID,
  Entity,
  EntityPropsBaseType,
  formatError,
  handleError,
  Result,
  SystemCode,
} from "@/core/shared";
import {
  CreateDosageScenario,
  DosageScenario,
  IDosageScenario,
} from "../valueObjects";

export interface INutritionalProduct extends EntityPropsBaseType {
  code: SystemCode<NUTRITIONAL_PRODUCT_CODE>;
  dosageTables: DosageScenario[];
}

export interface CreateNutritionalProduct {
  code: NUTRITIONAL_PRODUCT_CODE;
  dosageTables: CreateDosageScenario[];
}
export class NutritionalProduct extends Entity<INutritionalProduct> {
  getCode(): NUTRITIONAL_PRODUCT_CODE {
    return this.props.code.unpack();
  }
  getTables(): IDosageScenario[] {
    return this.props.dosageTables.map(table => table.unpack());
  }
  public validate(): void {
    this._isValid = false;
    // Implement the validation rule here;
    this._isValid = true;
  }
  static create(
    createProps: CreateNutritionalProduct,
    id: AggregateID
  ): Result<NutritionalProduct> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const tablesRes = createProps.dosageTables.map(table =>
        DosageScenario.create(table)
      );
      const combinedRes = Result.combine([codeRes, ...tablesRes]);
      if (combinedRes.isFailure) {
        return Result.fail(formatError(combinedRes, NutritionalProduct.name));
      }
      return Result.ok(
        new NutritionalProduct({
          id,
          props: {
            code: codeRes.val,
            dosageTables: tablesRes.map(res => res.val),
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
