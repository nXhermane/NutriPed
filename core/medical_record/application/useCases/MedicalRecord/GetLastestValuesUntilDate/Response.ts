import { CreateAnthropometricRecord, CreateBiologicalValueRecord, CreateClinicalSignDataRecord, CreateComplicationDataRecord, CreateDataFieldResponse } from "@/core/medical_record/domain";
import { Either, ExceptionBase, Result } from "@/core/shared";
export type GetLastestValuesUnitlDateDto = {
    anthropometric: CreateAnthropometricRecord[]
    biological: CreateBiologicalValueRecord[]
    clinical: CreateClinicalSignDataRecord[]
    dataFields: Omit<CreateDataFieldResponse, "recordAt">[];
    complication: CreateComplicationDataRecord[]
}
export type GetLatestValuesUntilDateResponse = Either<ExceptionBase | unknown, Result<GetLastestValuesUnitlDateDto>>

