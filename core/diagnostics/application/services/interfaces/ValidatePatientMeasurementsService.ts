import { AppServiceResponse, Message } from "@shared";
import { ValidateMeasurementsRequest } from "../../useCases";

export interface IValidatePatientMeasurementsService {
   validate(req: ValidateMeasurementsRequest): Promise<AppServiceResponse<boolean> | Message>;
}
