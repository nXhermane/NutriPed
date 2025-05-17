import { AggregateID, EmptyStringError, Entity, EntityPropsBaseType, formatError, Guard, handleError, Result, Sex, SystemCode } from "@shared";
import { ChartData, IChartData } from "./../valueObjects";
import { GrowthStandard } from "../constants";

export interface IGrowthReferenceChart extends EntityPropsBaseType {
   code: SystemCode;
   name: string;
   standard: GrowthStandard;
   sex: Sex;
   data: ChartData[];
}
export interface CreateGrowthReferenceChartProps {
   code: string;
   name: string;
   sex: `${Sex}`;
   standard: GrowthStandard;
   data: IChartData[];
}
export class GrowthReferenceChart extends Entity<IGrowthReferenceChart> {
   getCode(): string {
      return this.props.code.unpack();
   }
   getName(): string {
      return this.props.name;
   }
   getSex(): Sex {
      return this.props.sex;
   }
   getStandard(): GrowthStandard {
      return this.props.standard;
   }
   getChartData(): IChartData[] {
      return this.props.data.map((chartData) => chartData.unpack());
   }

   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeSex(sex: Sex) {
      this.props.sex = sex;
      this.validate();
   }
   changeStandard(standard: GrowthStandard) {
      this.props.standard = standard;
      this.validate();
   }
   changeData(chartData: ChartData[]) {
      this.props.data = chartData;
      this.validate();
   }

   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) throw new EmptyStringError("The name of GrowthReferenceChart can't be empty.");
      this._isValid = true;
   }

   static create(createProps: CreateGrowthReferenceChartProps, id: AggregateID): Result<GrowthReferenceChart> {
      try {
         const codeRes = SystemCode.create(createProps.code);
         const chartDataRes = createProps.data.map((chartData) => ChartData.create(chartData));
         const combinedRes = Result.combine([codeRes, ...chartDataRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, GrowthReferenceChart.name));

         const growthReferenceChart = new GrowthReferenceChart({
            id,
            props: {
               name: createProps.name,
               code: codeRes.val,
               standard: createProps.standard,
               sex: createProps.sex as Sex,
               data: chartDataRes.map((chartData) => chartData.val),
            },
         });
         return Result.ok(growthReferenceChart);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
