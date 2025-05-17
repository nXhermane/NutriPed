import { SystemCode, Condition, ICondition, ValueObject, Guard, EmptyStringError, Result, handleError, formatError } from "@shared";

export interface IAdmissionType {
   name: string;
   code: SystemCode;
   condition: Condition;
}

export interface CreateAdmissionType {
   code: string;
   name: string;
   condition: ICondition;
}

export class AdmissionType extends ValueObject<IAdmissionType> {
   protected validate(props: Readonly<IAdmissionType>): void {
      if (Guard.isEmpty(props.name).succeeded) {
         throw new EmptyStringError("The name of admission type can't be empty.");
      }
   }

   static create(createProps: CreateAdmissionType): Result<AdmissionType> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const conditionRes = Condition.create(createProps.condition);
         const combinedRes = Result.combine([codeRes, conditionRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, AdmissionType.name));
         return Result.ok(new AdmissionType({ name: createProps.name, code: codeRes.val, condition: conditionRes.val }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
