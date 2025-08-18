import { Result } from "@/core/shared";
import { DataFieldReference, DataFieldResponse } from "../../models";


export interface IDataFieldValidatationService {
    validate(data: DataFieldResponse[], dataFieldReference: DataFieldReference[]): Result<void>
}
