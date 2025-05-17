import { evaluateFormula, handleError, Result, SystemCode } from "@shared";
import {
   APPETITE_TEST_CODES,
   APPETITE_TEST_RESULT_CODES,
   AppetiteTestData,
   AppetiteTestRef,
   AppetiteTestResult,
   TakenAmountInSachet,
   TakenAmountOfPot,
} from "../models";
import { AppetiteTestRefRepository, IAppetiteTestService } from "../ports";
import { APPETITE_TEST_ERRORS, handleAppetiteTestError } from "../errors";

export class AppetiteTestService implements IAppetiteTestService {
   constructor(private readonly repo: AppetiteTestRefRepository) {}
   async test(data: AppetiteTestData): Promise<Result<AppetiteTestResult>> {
      try {
         const appetiteTestRef = await this.getAppetiteTestRef();
         if (appetiteTestRef.isFailure) {
            return handleAppetiteTestError(
               APPETITE_TEST_ERRORS.SERVICE.APPETITE_TEST_REF_NOT_FOUND.path,
               `Res: ${appetiteTestRef.err}`,
            ) as Result<AppetiteTestResult>;
         }
         const { patientWeight, takenAmount } = data.unpack();
         const appetiteTestTableRange = appetiteTestRef.val
            .getAppetiteTestTable()
            .find((range) => range.weightRange[0] <= patientWeight && range.weightRange[1] >= patientWeight);
         if (!appetiteTestTableRange) {
            return handleAppetiteTestError(
               APPETITE_TEST_ERRORS.SERVICE.APPETITE_TEST_RANGE_NOT_FOUND_FOR_THE_GIVEN_WEIGHT.path,
               `PatientWeight: ${patientWeight}`,
            ) as Result<AppetiteTestResult>;
         }

         if (data.productTypeIsSachet()) {
            const sachetRange = appetiteTestTableRange.sachetRange;
            const min = Number(evaluateFormula(sachetRange[0]));
            const sachetTakenAmount = Number(evaluateFormula((takenAmount as TakenAmountInSachet).takenFraction));
            return AppetiteTestResult.create({
               code: APPETITE_TEST_CODES.CODE,
               result: min <= sachetTakenAmount ? APPETITE_TEST_RESULT_CODES.GOOD : APPETITE_TEST_RESULT_CODES.BAD,
            });
         } else {
            const potRange = appetiteTestTableRange.potRange;
            const potTakenAmount = (takenAmount as TakenAmountOfPot).takenQuantity;
            return AppetiteTestResult.create({
               code: APPETITE_TEST_CODES.CODE,
               result: potRange[0] <= potTakenAmount ? APPETITE_TEST_RESULT_CODES.GOOD : APPETITE_TEST_RESULT_CODES.BAD,
            });
         }
      } catch (e) {
         return handleError(e);
      }
   }
   // BETA: Checker plustard
   private async getAppetiteTestRef(): Promise<Result<AppetiteTestRef>> {
      try {
         const code = new SystemCode({ _value: APPETITE_TEST_CODES.CODE });
         const ref = await this.repo.getByCode(code);
         return Result.ok(ref);
      } catch (e) {
         return handleError(e);
      }
   }
}
