import { formatError, handleError, Result, SystemCode, ValueObject } from "@shared";
import { Condition, ICondition } from "../../../common";

export interface IAvailableTable {
   tableCode: SystemCode;
   condition: Condition;
}
export interface CreateAvailableTableProps {
   tableCode: string;
   condition: ICondition;
}
export class AvailableTable extends ValueObject<IAvailableTable> {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected validate(props: Readonly<IAvailableTable>): void {}
   static create(createProps: CreateAvailableTableProps): Result<AvailableTable> {
      try {
         const codeRes = SystemCode.create(createProps.tableCode);
         const conditionRes = Condition.create(createProps.condition);
         const combinedRes = Result.combine([codeRes, conditionRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, AvailableTable.name));
         return Result.ok(new AvailableTable({ tableCode: codeRes.val, condition: conditionRes.val }));
      } catch (e) {
         return handleError(e);
      }
   }
}
