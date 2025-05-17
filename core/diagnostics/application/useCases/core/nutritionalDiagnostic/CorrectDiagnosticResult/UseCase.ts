import { DomainDate, GenerateUniqueId, handleError, left, Result, right, UseCase } from "@shared";
import { CorrectDiagnosticResultRequest } from "./Request";
import { CorrectDiagnosticResultResponse } from "./Response";
import {
   DiagnosticModification,
   NutritionalAssessmentResult,
   NutritionalDiagnosticRepository,
} from "../../../../../domain";

// REFACTOR: Refactoriser ce code plus tard et le separer en plusieur methodes
export class CorrectDiagnosticResultUseCase implements UseCase<CorrectDiagnosticResultRequest, CorrectDiagnosticResultResponse> {
   constructor(private readonly idGenerator: GenerateUniqueId, private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository) {}
   async execute(request: CorrectDiagnosticResultRequest): Promise<CorrectDiagnosticResultResponse> {
      try {
         const nutritionalDiagnostic = await this.nutritionalDiagnosticRepo.getById(request.nutritionalDiagnosticId);
         const prevNutritionalAssessmentResult = nutritionalDiagnostic.getDiagnosticResult();
         if (!prevNutritionalAssessmentResult) return left(Result.fail("Please Generate an NutritionalDiagnostic before decide to modify it."));
         const nutritionalAssessmentResult = NutritionalAssessmentResult.create(
            request.nutritionalAssessmentResultData.data,
            this.idGenerator.generate().toValue(),
         );
         if (nutritionalAssessmentResult.isFailure) return left(nutritionalAssessmentResult);
         const diagnosticModification = DiagnosticModification.create({
            prevResult: prevNutritionalAssessmentResult,
            nextResult: nutritionalAssessmentResult.val,
            reason: request.reason,
            date: new DomainDate(),
         });
         if (diagnosticModification.isFailure) return left(diagnosticModification);
         nutritionalDiagnostic.correctDiagnostic(diagnosticModification.val);
         await this.nutritionalDiagnosticRepo.save(nutritionalDiagnostic);
         return right(Result.ok(true));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
}
