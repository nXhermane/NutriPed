import { EmptyStringError, Guard, handleError, Result, SystemCode, ValueObject } from "@shared";
import { BiochemicalRangeStatus } from "../constants";

export interface IBiologicalAnalysisInterpretation {
   code: SystemCode;
   interpretation: string[];
   status: BiochemicalRangeStatus;
}
export interface CreateBiologicalAnalysisInterpretationProps {
   code: string;
   interpretation: string[];
   status?: BiochemicalRangeStatus; // Optional, defaults to 'Normal' if not provided
}
export class BiologicalAnalysisInterpretation extends ValueObject<IBiologicalAnalysisInterpretation> {
   protected validate(props: Readonly<IBiologicalAnalysisInterpretation>): void {
      if (Guard.isEmpty(props.interpretation).succeeded) {
         throw new EmptyStringError("The Biological Analysis Interpretation can't be empty.");
      }
   }
   static create(props: CreateBiologicalAnalysisInterpretationProps): Result<BiologicalAnalysisInterpretation> {
      try {
         const codeRes = SystemCode.create(props.code);
         if (codeRes.isFailure) return Result.fail(String(codeRes.err));
         return Result.ok(
            new BiologicalAnalysisInterpretation({
               code: codeRes.val,
               interpretation: props.interpretation, // Ensure no leading/trailing whitespace
               // If status is not provided, default to 'Normal'
               status: props.status ?? BiochemicalRangeStatus.NORMAL, // Default to 'Normal' if not provided
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
