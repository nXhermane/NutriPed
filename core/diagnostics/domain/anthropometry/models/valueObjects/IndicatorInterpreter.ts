import { EmptyStringError, formatError, Guard, handleError, Result, SystemCode, ValueObject } from "@shared";
import { Condition, ICondition } from "../../../common";
import { GrowthIndicatorRange } from "../constants";

/**
 * @interface IIndicatorInterpreter : C'est l'interpretation associé a une condition
 * @property `name` - C'est le nom de l'interpretation par ex: Obésité | InsuffisancePondérale | Normale
 * @property `code` - C'est le code associé a ce nom
 * @property `condition` - C'est la condition qui designe cette interpetation par ex: -3< z < -2
 */
export interface IIndicatorInterpreter {
   name: string;
   code: SystemCode;
   range: GrowthIndicatorRange;
   condition: Condition;
}
export interface CreateIndicatorInterpreter {
   name: string;
   code: string;
   range: GrowthIndicatorRange; // Cela va remplacer l'utilisation de condition plustard
   condition: ICondition;
}
export class IndicatorInterpreter extends ValueObject<IIndicatorInterpreter> {
   protected validate(props: Readonly<IIndicatorInterpreter>): void {
      if (Guard.isEmpty(props.name).succeeded) throw new EmptyStringError("The name of ChartInterpretation can't be empty.");
   }

   static create(createProps: CreateIndicatorInterpreter): Result<IndicatorInterpreter> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const conditionRes = Condition.create(createProps.condition);
         const combinedRes = Result.combine([conditionRes, codeRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, IndicatorInterpreter.name));
         return Result.ok(
            new IndicatorInterpreter({
               name: createProps.name,
               code: codeRes.val,
               range: createProps.range,
               condition: conditionRes.val,
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
