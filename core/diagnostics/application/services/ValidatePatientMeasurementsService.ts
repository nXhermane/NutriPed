import { AppServiceResponse, Message, UseCase } from "@shared";
import { ValidateMeasurementsRequest, ValidateMeasurementsResponse } from "../useCases";
import { IValidatePatientMeasurementsService } from "./interfaces";
export interface ValidatePatientMeasurementsServiceUseCases {
   validateUC: UseCase<ValidateMeasurementsRequest, ValidateMeasurementsResponse>;
}
export class ValidatePatientMeasurementsService implements IValidatePatientMeasurementsService {
    constructor(private readonly ucs: ValidatePatientMeasurementsServiceUseCases) {}
   async validate(req: ValidateMeasurementsRequest): Promise<AppServiceResponse<boolean> | Message> {
  const res = await this.ucs.validateUC.execute(req);
      if (res.isRight()) return { data: res.value.val };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      else return new Message("error", JSON.stringify((res.value as any)?.err));
  
   }
}
