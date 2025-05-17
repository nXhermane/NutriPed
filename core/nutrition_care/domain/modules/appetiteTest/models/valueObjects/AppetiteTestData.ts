import { ArgumentInvalidException, Guard, handleError, NegativeValueError, Result, ValueObject } from "@shared";
import { APPETITE_TEST_PRODUCT_TYPE, APPETITE_TEST_SACHET_FRACTION_PARTITION } from "../constants";

export type TakenAmountOfPot = {
   takenQuantity: number;
};
export type TakenAmountInSachet = {
   takenFraction: APPETITE_TEST_SACHET_FRACTION_PARTITION;
};
export interface IAppetiteTestData {
   givenProductType: APPETITE_TEST_PRODUCT_TYPE;
   takenAmount: TakenAmountOfPot | TakenAmountInSachet;
   patientWeight: number;
}

//BETA: On verifie l'unite du takenQuantity, mais on s'assure que ce n'est pas égale a négative

export class AppetiteTestData extends ValueObject<IAppetiteTestData> {
   productTypeIsSachet(): boolean {
      return this.props.givenProductType === APPETITE_TEST_PRODUCT_TYPE.IN_SACHET;
   }
   protected validate(props: Readonly<IAppetiteTestData>): void {
      if (props.givenProductType === APPETITE_TEST_PRODUCT_TYPE.IN_SACHET) {
         if (Guard.isEmpty((props.takenAmount as TakenAmountInSachet)?.takenFraction).succeeded)
            throw new ArgumentInvalidException("Please if the taken product is in sachet provide a product taken fraction in available options.");
         // BETA: Donnons d'abord la liberter de donne n'importe quelle fraction
         //  else if (!Object.values(APPETITE_TEST_SACHET_FRACTION_PARTITION).includes((props.takenAmount as TakenAmountInSachet)?.takenFraction))
         //     throw new ArgumentOutOfRangeException("This fraction is not supported");
      }
      if (props.givenProductType === APPETITE_TEST_PRODUCT_TYPE.IN_POT) {
         if (Guard.isEmpty((props.takenAmount as TakenAmountOfPot).takenQuantity).succeeded)
            throw new ArgumentInvalidException("Please if the taken product is in pot, provide the taken amount as a number");
         else if (Guard.isNegative((props.takenAmount as TakenAmountOfPot).takenQuantity).succeeded)
            throw new NegativeValueError("Please the taken amount can't be a negative number, change it and retry.");
      }
      if (Guard.isNegative(props.patientWeight).succeeded || props.patientWeight === 0) {
         throw new NegativeValueError("The patient Weight can't be negative or equal to zero.");
      }
   }
   static create(props: IAppetiteTestData): Result<AppetiteTestData> {
      try {
         return Result.ok(new AppetiteTestData(props));
      } catch (e) {
         return handleError(e);
      }
   }
}
