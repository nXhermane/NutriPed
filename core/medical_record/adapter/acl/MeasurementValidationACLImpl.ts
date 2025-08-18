import {
  IValidatePatientMeasurementsService,
  ValidateMeasurementsRequest,
} from "@/core/evaluation";
import {
  MeasurementData,
  MeasurementValidationACL,
} from "@core/medical_record";
import { AggregateID, handleError, Result } from "@shared";

export class MeasurementValidationACLImpl implements MeasurementValidationACL {
  constructor(
    private readonly validateMeasurementsService: IValidatePatientMeasurementsService
  ) {}

  async validate(
    patientId: AggregateID,
    measurements: MeasurementData
  ): Promise<Result<boolean>> {
    try {
      // Transformation vers le format attendu par le service de validation
      const request: ValidateMeasurementsRequest = {
        patientId,
        anthropometricData: {
          data: measurements.anthropometricData.map(measure => {
            return {
              code: measure.getCode(),
              ...measure.getMeasurement(),
            };
          }),
        },
        clinicalData: measurements.clinicalData.map(sign => {
          return {
            code: sign.getCode(),
            data: sign.getData(),
          };
        }),
        biologicalTestResults: measurements.biologicalData.map(test => {
          return {
            code: test.getCode(),
            ...test.getMeasurement(),
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
