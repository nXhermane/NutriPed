import { handleError, Result } from "@shared";
import { BiochemicalRangeStatus, BiologicalAnalysisInterpretation } from "../models";
import { BiochemicalReferenceRepository, BiologicalVariableObject, IBiologicalVariableGeneratorService, RangeStatusLiteral } from "../ports";

export class BiologicalVariableGeneratorService implements IBiologicalVariableGeneratorService {
   constructor(private readonly biologicalRefRepo: BiochemicalReferenceRepository) {}
   async generate(interpretation: BiologicalAnalysisInterpretation[]): Promise<Result<BiologicalVariableObject>> {
      try {
         const biologicalReferences = (await this.biologicalRefRepo.getAllCode()).map((bioRef) => bioRef.unpack());
         const biologicalInterpretations = new Map<string, RangeStatusLiteral>(
            interpretation.map((bioInterpretation) => {
               const code = bioInterpretation.unpack().code.unpack();
               const range = bioInterpretation.unpack().status;
               return [code, range];
            }),
         );
         const biologicalVariableObject: BiologicalVariableObject = {};
         for (const biochemicalRef of biologicalReferences) {
            if (biologicalInterpretations.has(biochemicalRef)) {
               biologicalVariableObject[biochemicalRef] = biologicalInterpretations.get(biochemicalRef)!;
            } else {
               biologicalVariableObject[biochemicalRef] = BiochemicalRangeStatus.NORMAL;
            }
         }
         return Result.ok(biologicalVariableObject);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
