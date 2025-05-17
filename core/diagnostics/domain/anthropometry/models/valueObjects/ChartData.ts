import { ArgumentInvalidException, Guard, handleError, Result, ValueObject } from "@shared";

/**
 * @interface IChartData : C'est la ligne de chaque Courbe de reference dans le fichier excel
 * |Property|Type|Desc|
 * |----------|--------|-------|
 * | `value` | `Number` | C'est la valeur du row |
 * | `median` | `Number` | C'est la mediane des valeurs de référence |
 * | `l` | `Number` | C'est l'indice de puissance pour la tansformation |
 * | `s` | `Number` | C'est le coefficient de variation |
 * | `curvePoints` | `Record<string\|number>` | C'est les ecart-types |
 */
export interface IChartData {
   value: number;
   median: number;
   l: number;
   s: number;
   curvePoints: Record<string, number>;
}

export class ChartData extends ValueObject<IChartData> {
   protected validate(props: Readonly<IChartData>): void {
      const isNumbers = [
         !Guard.isNumber(props.value).succeeded,
         !Guard.isNumber(props.median).succeeded,
         !Guard.isNumber(props.l).succeeded,
         !Guard.isNumber(props.s).succeeded,
         ...Object.values(props.curvePoints).map((val) => !Guard.isNumber(val).succeeded),
      ];
      if (isNumbers.some(Boolean))
         throw new ArgumentInvalidException("The value|median|l|s|curvePoints must be a number. Please ensure the property is number.");
   }
   static create(props: IChartData): Result<ChartData> {
      try {
         return Result.ok(new ChartData(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
