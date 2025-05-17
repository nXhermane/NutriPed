import { formatError, Guard, handleError, Result, UnitCode, ValueObject } from "@shared";
import { MilkType } from "../../../modules";

export interface INutritionalTreatmentAction {
   milkType: MilkType;
   milkVolume: number;
   milkVolumeUnit: UnitCode;
   feedingFrequency: number;
}
export interface CreateNutritionalTreatmentAction {
   milkType: MilkType;
   milkVolume: number;
   milkVolumeUnit: string;
   feedingFrequency: number;
}

export class NutritionalTreatmentAction extends ValueObject<INutritionalTreatmentAction> {
   protected validate(props: Readonly<INutritionalTreatmentAction>): void {
      if (Guard.isNegative(props.milkVolume).succeeded) {
         throw new Error("NutritionalTreatmentAction milkVolume can't be negative.");
      }
      if (Guard.isNegative(props.feedingFrequency).succeeded) {
         throw new Error("NutritionalTreatmentAction feedingFrequency can't be negative.");
      }
   }
   static create(createProps: CreateNutritionalTreatmentAction): Result<NutritionalTreatmentAction> {
      try {
         const unitRes = UnitCode.create(createProps.milkVolumeUnit);
         const combinedRes = Result.combine([unitRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, NutritionalTreatmentAction.name));
         const props: INutritionalTreatmentAction = {
            milkType: createProps.milkType,
            milkVolume: createProps.milkVolume,
            milkVolumeUnit: unitRes.val,
            feedingFrequency: createProps.feedingFrequency,
         };
         return Result.ok(new NutritionalTreatmentAction(props));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
