import {
   AggregateID,
   ArgumentNotProvidedException,
   Condition,
   EmptyStringError,
   Entity,
   EntityPropsBaseType,
   formatError,
   Formula,
   Guard,
   handleError,
   ICondition,
   IFormula,
   Result,
} from "@shared";
import { MilkType, RecommendedMilkPerDay } from "../constants";
import { IRecommendedMilkPerWeightRange, RecommendedMilkPerWeightRange } from "../valueObjects";

export interface IMilk extends EntityPropsBaseType {
   name: string;
   type: MilkType;
   doseFormula: Formula;
   condition: Condition;
   recommendedMilkPerDay: RecommendedMilkPerDay[];
   recommendationPerRanges: RecommendedMilkPerWeightRange[];
}

export interface CreateMilkProps {
   name: string;
   type: MilkType;
   doseFormula: IFormula;
   condition: ICondition;
   recommendedMilkPerDay: RecommendedMilkPerDay[];
   recommendationPerRanges: IRecommendedMilkPerWeightRange[];
}

export class Milk extends Entity<IMilk> {
   getName(): string {
      return this.props.name;
   }
   getType(): MilkType {
      return this.props.type;
   }
   getCondition(): ICondition {
      return this.props.condition.unpack();
   }
   getDoseFormula(): IFormula {
      return this.props.doseFormula.unpack();
   }
   getRecommendedMilkPerDay(): RecommendedMilkPerDay[] {
      return this.props.recommendedMilkPerDay;
   }
   getRanges(): IRecommendedMilkPerWeightRange[] {
      return this.props.recommendationPerRanges.map((range) => range.unpack());
   }
   changeName(name: string) {
      this.props.name = name;
      this.validate();
   }
   changeType(type: MilkType) {
      this.props.type = type;
      this.validate();
   }
   changeCondition(condition: Condition) {
      this.props.condition = condition;
      this.validate();
   }
   changeDoseFormula(formula: Formula) {
      this.props.doseFormula = formula;
      this.validate();
   }
   changeRecommendedMilkPerDay(recommendedMilkPerDay: RecommendedMilkPerDay[]) {
      this.props.recommendedMilkPerDay = recommendedMilkPerDay;
      this.validate();
   }
   changeRanges(ranges: RecommendedMilkPerWeightRange[]) {
      this.props.recommendationPerRanges = ranges;
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (Guard.isEmpty(this.props.name).succeeded) {
         throw new EmptyStringError("The milk name can't be empty.");
      }
      if (Guard.isEmpty(this.props.recommendedMilkPerDay).succeeded) {
         throw new ArgumentNotProvidedException("The milk must have the recommended milk taken per day.");
      }
      this._isValid = true;
   }

   static create(createProps: CreateMilkProps, id: AggregateID): Result<Milk> {
      try {
         const doseFormulaRes = Formula.create(createProps.doseFormula);
         const conditionRes = Condition.create(createProps.condition);
         const rangesRes = createProps.recommendationPerRanges.map(RecommendedMilkPerWeightRange.create);
         const combinedRes = Result.combine([doseFormulaRes, conditionRes, ...rangesRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, Milk.name));
         const milk = new Milk({
            id,
            props: {
               name: createProps.name,
               condition: conditionRes.val,
               doseFormula: doseFormulaRes.val,
               type: createProps.type,
               recommendedMilkPerDay: createProps.recommendedMilkPerDay,
               recommendationPerRanges: rangesRes.map((res) => res.val),
            },
         });
         return Result.ok(milk);
      } catch (e) {
         return handleError(e);
      }
   }
}
