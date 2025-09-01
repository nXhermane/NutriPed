import { CreateAnthropometricRecord, CreateAppetiteTestRecord, CreateBiologicalValueRecord, CreateClinicalSignDataRecord, CreateDataFieldResponse } from "@/core/medical_record/domain";
import { AggregateID, Either, ExceptionBase, Result } from "@/core/shared";
export type GetLastestValuesUnitlDateDto = {
    anthropometric: (CreateAnthropometricRecord & {
        recordedAt: string;
        id: AggregateID;
    })[];
    biological: (CreateBiologicalValueRecord & {
        recordedAt: string;
        id: AggregateID;
    })[];
    clinical: (CreateClinicalSignDataRecord & {
        recordedAt: string;
        id: AggregateID;
    })[];
    dataFields: (Omit<CreateDataFieldResponse, "recordAt"> & {
        recordedAt: string;
        id: AggregateID;
    })[];
}
export type GetLatestValuesUntilDateResponse = Either<ExceptionBase | unknown, Result<GetLastestValuesUnitlDateDto>>

