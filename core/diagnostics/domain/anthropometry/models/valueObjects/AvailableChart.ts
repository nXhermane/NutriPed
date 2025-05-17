import { formatError, handleError, Result, SystemCode, ValueObject } from "@shared";
import { Condition, ICondition } from "../../../common";

export interface IAvailableChart {
   chartCode: SystemCode;
   condition: Condition;
}

export interface CreateAvailableChart {
   chartCode: string;
   condition: ICondition;
}

export class AvailableChart extends ValueObject<IAvailableChart> {
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   protected validate(_props: Readonly<IAvailableChart>): void {}
   static create(createProps: CreateAvailableChart): Result<AvailableChart> {
      try {
         const codeRes = SystemCode.create(createProps.chartCode);
         const conditionRes = Condition.create(createProps.condition);
         const combinedRes = Result.combine([conditionRes, codeRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, AvailableChart.name));
         return Result.ok(new AvailableChart({ chartCode: codeRes.val, condition: conditionRes.val }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
