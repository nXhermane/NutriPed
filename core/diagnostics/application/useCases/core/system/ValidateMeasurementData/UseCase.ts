import { AggregateID, Birthday, formatError, Gender, handleError, left, Result, right, UseCase } from "@shared";
import { ValidateMeasurementsRequest } from "./Request";
import { ValidateMeasurementsResponse } from "./Response";
import {
   AnthropometricData,
   BiologicalTestResult,
   ClinicalData,
   IPatientDataValidationService,
   NutritionalDiagnosticRepository,
   PatientDiagnosticData,
} from "./../../../../../domain";

type MeasurementsData = {
   anthropometricData: AnthropometricData;
   clinicalData: ClinicalData;
   biologicalResults: BiologicalTestResult[];
};
export class ValidateMeasurementsUseCase implements UseCase<ValidateMeasurementsRequest, ValidateMeasurementsResponse> {
   constructor(
      private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
      private readonly patientValidationService: IPatientDataValidationService,
   ) {}

   async execute(request: ValidateMeasurementsRequest): Promise<ValidateMeasurementsResponse> {
      try {
         const nutritionalDiagnostic = await this.nutritionalDiagnosticRepo.getByIdOrPatientId(request.patientId);
         const { id, gender, birthday, clinicalSigns } = nutritionalDiagnostic.getPatientData().getProps();

         const measuresResult = await this.buildMeasurements(request, clinicalSigns);
         if (measuresResult.isFailure) return left(measuresResult);

         const patientData = this.buildPatientData(id, gender, birthday, measuresResult.val);
         return await this.validatePatientData(patientData);
      } catch (error) {
         return left(handleError(error));
      }
   }

   private async buildMeasurements(request: ValidateMeasurementsRequest, clinicalSigns: ClinicalData): Promise<Result<MeasurementsData>> {
      const anthropometricData = AnthropometricData.create({
         anthropometricMeasures: request.anthropometricData.data,
      });

      const clinicalEdema = clinicalSigns.unpack().edema.unpack();
      const clinicalData = ClinicalData.create({
         edema: {
            code: clinicalEdema.code.unpack(),
            data: clinicalEdema.data,
         },
         otherSigns: request.clinicalData,
      });

      const biologicalData = request.biologicalTestResults.map(BiologicalTestResult.create);
      const combinedRes = Result.combine([anthropometricData, clinicalData, ...biologicalData]);

      if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, ValidateMeasurementsUseCase.name));

      return Result.ok({
         anthropometricData: anthropometricData.val,
         clinicalData: clinicalData.val,
         biologicalResults: biologicalData.map((r) => r.val),
      });
   }

   private buildPatientData(id: AggregateID, gender: Gender, birthday: Birthday, measurements: MeasurementsData): PatientDiagnosticData {
      return new PatientDiagnosticData({
         id,
         props: {
            gender,
            birthday,
            anthropMeasures: measurements.anthropometricData,
            biologicalTestResults: measurements.biologicalResults,
            clinicalSigns: measurements.clinicalData,
         },
      });
   }

   private async validatePatientData(patientData: PatientDiagnosticData): Promise<ValidateMeasurementsResponse> {
      const validationResult = await this.patientValidationService.validate(patientData);
      if (validationResult.isFailure) return left(validationResult);
      return right(Result.ok(true));
   }
}
