import {
  AggregateID,
  EmptyStringError,
  Entity,
  EntityPropsBaseType,
  formatError,
  Guard,
  handleError,
  Result,
  SystemCode,
} from "@shared";
import { GrowthStandard } from "../constants";
import { ITableData, TableData } from "../valueObjects";

/**
 * @interface IGrowthReferenceTable
 * @property {string} name - C'est le nom de la table de reference
 * @property {string} standard - C'est la norme que cette table utiliser
 * @property {SystemCode} code - C'est le code de cette table au niveau du systeme
 * @property {TableData} data - Ce sont les données au niveau de chaque row
 *
 * @NOTE
 * ```ts
 * // Si jamais c'est la taille pour les tables unisexe c'est cette facons on va utliser pour pouvoir l'arround depuis le x au lieu de l'ecrie explicitement dans le code : Cela est propre a chaque table
 * const arroundHeight = `(height - (height % 1)) + ((height % 1)<=0.2 ? 0:((height %1)>=0.8?1:0.5))`
 * ```
 */
export interface IGrowthReferenceTable extends EntityPropsBaseType {
  name: string;
  code: SystemCode;
  standard: GrowthStandard;
  data: TableData[];
}
export interface CreateGrowthReferenceTableProps {
  name: string;
  code: string;
  standard: GrowthStandard;
  data: ITableData[];
}
export class GrowthReferenceTable extends Entity<IGrowthReferenceTable> {
  getName(): string {
    return this.props.name;
  }
  getCode(): string {
    return this.props.code.unpack();
  }
  getStandard(): GrowthStandard {
    return this.props.standard;
  }
  getTableData(): ITableData[] {
    return this.props.data.map(tableData => tableData.unpack());
  }

  changeName(name: string) {
    this.props.name = name;
    this.validate();
  }
  changeStandard(standard: GrowthStandard) {
    this.props.standard = standard;
    this.validate();
  }
  changeTableData(tableData: TableData[]) {
    this.props.data = tableData;
    this.validate();
  }
  public validate(): void {
    this._isValid = false;
    if (Guard.isEmpty(this.props.name).succeeded)
      throw new EmptyStringError(
        "The name of GrowthReferenceTable can't be empty."
      );
    this._isValid = true;
  }
  static create(
    createProps: CreateGrowthReferenceTableProps,
    id: AggregateID
  ): Result<GrowthReferenceTable> {
    try {
      const codeRes = SystemCode.create(createProps.code);
      const tableDataRes = createProps.data.map(tableData =>
        TableData.create(tableData)
      );
      const combinedRes = Result.combine([codeRes, ...tableDataRes]);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, GrowthReferenceTable.name));
      const growthRefTable = new GrowthReferenceTable({
        id: id,
        props: {
          name: createProps.name,
          standard: createProps.standard,
          code: codeRes.val,
          data: tableDataRes.map(res => res.val),
        },
      });
      return Result.ok(growthRefTable);
    } catch (e) {
      return handleError(e);
    }
  }
}
