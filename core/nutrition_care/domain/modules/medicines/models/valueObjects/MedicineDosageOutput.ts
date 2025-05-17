import { ArgumentOutOfRangeException, EmptyStringError, formatError, Guard, handleError, Result, SystemCode, ValueObject } from "@shared";
import { AdministrationRoute } from "../constants";
import { Amount, DosageRange, IDosageRange } from "./DosageRange";

export interface IMedicineDosageResult {
   name: string;
   code: SystemCode;
   label: string;
   dailyDosage: Amount;
   dailyDosageFrequency: number;
   administrationRoutes: AdministrationRoute[];
   weightRangeDosage: DosageRange;
}

export interface CreateMedicineDosageResult {
   name: string;
   code: string;
   label: string;
   dailyDosage: Amount;
   dailyDosageFrequency: number;
   administrationRoutes: AdministrationRoute[];
   weightRangeDosage: IDosageRange;
}
export class MedicineDosageResult extends ValueObject<IMedicineDosageResult> {
   protected validate(props: Readonly<IMedicineDosageResult>): void {
      if (Guard.isEmpty(props.name).succeeded) {
         throw new EmptyStringError("The name of medicine can't be empty.");
      }
      if (Guard.isEmpty(props.label).succeeded) {
         throw new EmptyStringError("The medicine label can't be empty.");
      }
      if (props.dailyDosageFrequency < 1) {
         throw new ArgumentOutOfRangeException("The medicine taken frequency must be greater than zero.");
      }
   }

   static create(createProps: CreateMedicineDosageResult): Result<MedicineDosageResult> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const weightRangeDosageRes = DosageRange.create(createProps.weightRangeDosage);
         const combinedRes = Result.combine([codeRes, weightRangeDosageRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, MedicineDosageResult.name));
         const medicine = new MedicineDosageResult({
            name: createProps.name,
            code: codeRes.val,
            dailyDosage: createProps.dailyDosage,
            dailyDosageFrequency: createProps.dailyDosageFrequency,
            administrationRoutes: createProps.administrationRoutes,
            weightRangeDosage: weightRangeDosageRes.val,
            label: createProps.label,
         });
         return Result.ok(medicine);
      } catch (e) {
         return handleError(e);
      }
   }
}
