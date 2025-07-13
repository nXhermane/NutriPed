import { handleError, left, Result, right, UseCase } from "@/core/shared";
import { MakeClinicalAnalysisRequest } from "./Request";
import { MakeClinicalAnalysisResponse } from "./Response";
import { AnthroSystemCodes, ClinicalData, DAY_IN_YEARS, EvaluationContext, IClinicalAnalysisService, IClinicalValidationService } from "./../../../../../domain";
import { ClinicalNutritionalAnalysisResultDto } from "@/core/diagnostics/application/dtos";

export class MakeClinicalAnalysisUseCase implements UseCase<MakeClinicalAnalysisRequest, MakeClinicalAnalysisResponse> {
    constructor(private readonly clinicalDataValidatorService: IClinicalValidationService, private readonly clinicalSignAnalyserServer: IClinicalAnalysisService) { }

    async execute(request: MakeClinicalAnalysisRequest): Promise<MakeClinicalAnalysisResponse> {
        try {
            const clinicalDataRes = this.createClinicalData(request)
            if (clinicalDataRes.isFailure) return left(clinicalDataRes)
            const evaluationContext = this.getEvaluationContext(request)
            const clinicalDataValidationRes = await this.clinicalDataValidatorService.validate(clinicalDataRes.val)
            if (clinicalDataValidationRes.isFailure) return left(clinicalDataValidationRes)
            const clinicalAnalysisRes = await this.clinicalSignAnalyserServer.analyze(clinicalDataRes.val, evaluationContext)
            if (clinicalAnalysisRes.isFailure) return left(clinicalAnalysisRes)
            const clinicalAnalysisResults = clinicalAnalysisRes.val
            const clinicalAnalysisResultDtos: ClinicalNutritionalAnalysisResultDto[] = clinicalAnalysisResults.map(clinicalAnalysis => {
                const { clinicalSign, recommendedTests, suspectedNutrients } =
                    clinicalAnalysis.unpack();
                return {
                    clinicalSign: clinicalSign.unpack(),
                    recommendedTests: recommendedTests.map(test => test.unpack()),
                    suspectedNutrients: suspectedNutrients.map(nutrient => {
                        const { effect, nutrient: code } = nutrient.unpack();
                        return { nutrient: code.unpack(), effect };
                    })
                }
            })
            return right(Result.ok(clinicalAnalysisResultDtos))
        } catch (e) {
            return left(handleError(e))
        }
    }
    private createClinicalData(request: MakeClinicalAnalysisRequest) {
        return ClinicalData.create({ clinicalSigns: request.clinicalSigns })
    }
    private getEvaluationContext(
        request: MakeClinicalAnalysisRequest
    ): EvaluationContext {
        return {
            [AnthroSystemCodes.AGE_IN_MONTH]: request[AnthroSystemCodes.AGE_IN_MONTH],
            [AnthroSystemCodes.AGE_IN_DAY]: request[AnthroSystemCodes.AGE_IN_DAY],
            age_in_year: request.age_in_day / DAY_IN_YEARS,
            [AnthroSystemCodes.SEX]: request[AnthroSystemCodes.SEX],
        };
    }

}