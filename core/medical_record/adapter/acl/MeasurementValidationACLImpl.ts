import { IValidatePatientMeasurementsService, ValidateMeasurementsRequest } from "@core/diagnostics";
import { MeasurementData, MeasurementValidationACL } from "@core/medical_record";
import { AggregateID, handleError, Result } from "@shared";

export class MeasurementValidationACLImpl implements MeasurementValidationACL {
   constructor(private readonly validateMeasurementsService: IValidatePatientMeasurementsService) {}

   async validate(patientId: AggregateID, measurements: MeasurementData): Promise<Result<boolean>> {
      try {
         // Transformation vers le format attendu par le service de validation
         const request: ValidateMeasurementsRequest = {
            patientId,
            anthropometricData: {
               data: measurements.anthropometricData.map((measure) => {
                  const { code, unit, value } = measure.unpack();
                  return {
                     code: code.unpack(),
                     value: value,
                     unit: unit.unpack(),
                  };
               }),
            },
            clinicalData: measurements.clinicalData.map((sign) => {
               const { code, data } = sign.unpack();
               return {
                  code: code.unpack(),
                  data,
               };
            }),
            biologicalTestResults: measurements.biologicalData.map((test) => {
               const { code, unit, value } = test.unpack();
               return {
                  code: code.unpack(),
                  unit: unit.unpack(),
                  value,
               };
            }),
         };

         const response = await this.validateMeasurementsService.validate(request);

         if ("data" in response) {
            return Result.ok(response.data);
         }

         return Result.fail(response.content);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
