import { formatError, handleError, Result } from "@/core/shared";
import { ValidateResult } from "../../../common";
import { ClinicalData } from "../models";
import { ClinicalSignReferenceRepository, IClinicalValidationService } from "../ports";
import { DataFieldResponse, DataFieldValidationService } from "../../../data_fields";
import { CLINICAL_ERRORS, handleClinicalError } from "../errors";

export class ClinicalValidationService implements IClinicalValidationService {
    constructor(private readonly dataFieldValidation: DataFieldValidationService, private readonly repo: ClinicalSignReferenceRepository) { }
    async validate(clinicalData: ClinicalData[]): Promise<Result<ValidateResult>> {
        try {
            const clinicalValidationResults = await Promise.all(clinicalData.map(data => this.validateClinicalData(data)))
            const combinedRes = Result.combine(clinicalValidationResults as any)
            if (combinedRes.isFailure) {
                return Result.fail(formatError(combinedRes, ClinicalValidationService.name))
            }
            return Result.ok({
                isValid: true
            })
        } catch (e: unknown) {
            return handleError(e)
        }
    }
    private async validateClinicalData(clinicalData: ClinicalData): Promise<Result<void>> {
        try {
            const data = clinicalData.getData()
            const reference = await this.repo.getByCode(clinicalData.unpack().code)
            const neededDataFields = reference.getNeededDataFields()
            for (const dataField of neededDataFields) {
                if (dataField.required && !(data[dataField.code] == undefined)) {
                    return handleClinicalError<void>(CLINICAL_ERRORS.VALIDATION.MISSING_DATA.path, `[MISSING_DATA_CODE]: ${dataField.code}`)
                }
            }
            const dataFieldsResponseResult = Object.entries(data).map(([code, value]) => DataFieldResponse.create({
                code, value
            }))
            const combinedRes = Result.combine(dataFieldsResponseResult)
            if (combinedRes.isFailure) {
                return Result.fail(formatError(combinedRes, ClinicalValidationService.name))
            }
            const dataFieldValidationResult = await this.dataFieldValidation.validate(dataFieldsResponseResult.map(res => res.val))
            if (dataFieldValidationResult.isFailure) {
                return handleClinicalError(CLINICAL_ERRORS.VALIDATION.INVALID_DATA.path)
            }

            return Result.ok(void 0)
        } catch (e: unknown) {
            return handleError(e)
        }

    }



}