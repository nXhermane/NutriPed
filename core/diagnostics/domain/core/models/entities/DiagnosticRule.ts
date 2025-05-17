import {
   AggregateID,
   ArgumentOutOfRangeException,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   formatError,
   Guard,
   handleError,
   Result,
   SystemCode,
} from "@shared";
import { DiagnosticCondition, IDiagnosticCondition } from "../valueObjects";

export interface IDiagnosticRule extends EntityPropsBaseType {
   name: string;
   code: SystemCode;
   conditions: DiagnosticCondition[];
}

export interface CreateDiagnosticRule {
   name: string;
   code: string;
   conditions: IDiagnosticCondition[];
}

export class DiagnosticRule extends Entity<IDiagnosticRule> {
   static MIN_CONDITION = 1;
   getName(): string {
      return this.props.name;
   }
   getCode(): string {
      return this.props.code.unpack();
   }
   getConditions(): IDiagnosticCondition[] {
      return this.props.conditions.map((condition) => condition.unpack());
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeConditions(conditions: DiagnosticCondition[]) {
      this.props.conditions = conditions;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of Diagnostic Rule can't be empty.");
      if (this.props.conditions.length < DiagnosticRule.MIN_CONDITION)
         throw new ArgumentOutOfRangeException("The diagnostic Rule must contains DiagnosticCondition.");
      this._isValid = true;
   }

   static create(createProps: CreateDiagnosticRule, id: AggregateID): Result<DiagnosticRule> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const diagnosticConditionsRes = createProps.conditions.map(DiagnosticCondition.create);
         const combinedRes = Result.combine([codeRes, ...diagnosticConditionsRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, DiagnosticRule.name));
         return Result.ok(
            new DiagnosticRule({
               id,
               props: {
                  name: createProps.name,
                  code: codeRes.val,
                  conditions: diagnosticConditionsRes.map((res) => res.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
