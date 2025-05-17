import { formatError, Guard, handleError, NegativeValueError, Result, SystemCode, UnitCode, ValueObject } from "@shared";

export interface IBiologicalTestResult {
   code: SystemCode;
   value: number;
   unit: UnitCode;
}
export type CreateBiologicalTestResult = {
   code: string;
   value: number;
   unit: string;
};
export class BiologicalTestResult extends ValueObject<IBiologicalTestResult> {
   protected validate(props: Readonly<IBiologicalTestResult>): void {
      if (Guard.isNegative(props.value).succeeded) {
         throw new NegativeValueError("The BiologicalTestResult value can't be an negative value. Please provide a positive value.");
      }
   }
   static create(createProps: CreateBiologicalTestResult): Result<BiologicalTestResult> {
      try {
         const unitCode = UnitCode.create(createProps.code);
         const codeRes = SystemCode.create(createProps.code);
         const combinedRes = Result.combine([unitCode, codeRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, BiologicalTestResult.name));
         const biologicalTestResult = new BiologicalTestResult({
            code: codeRes.val,
            value: createProps.value,
            unit: unitCode.val,
         });
         return Result.ok(biologicalTestResult);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
