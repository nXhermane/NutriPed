import { ApplicationMapper, formatError, handleError, left, Result, right, UseCase, ValueType } from "@shared";
import { UpdatePatientDiagnosticDataRequest } from "./Request";
import { UpdatePatientDiagnosticDataResponse } from "./Response";
import {
   AnthropometricData,
   BiologicalTestResult,
   ClinicalData,
   ClinicalSign,
   CreateBiologicalTestResult,
   CreateClinicalData,
   IPatientDataValidationService,
   NutritionalDiagnostic,
   NutritionalDiagnosticRepository,
   PatientDiagnosticData,
} from "../../../../../domain";
import { PatientDiagnosticDataDto } from "../../../../dtos";

export class UpdatePatientDiagnosticDataUseCase implements UseCase<UpdatePatientDiagnosticDataRequest, UpdatePatientDiagnosticDataResponse> {
   constructor(
      private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
      private readonly patientValidationService: IPatientDataValidationService,
      private readonly mapper: ApplicationMapper<PatientDiagnosticData, PatientDiagnosticDataDto>,
   ) {}
   async execute(request: UpdatePatientDiagnosticDataRequest): Promise<UpdatePatientDiagnosticDataResponse> {
      try {
         const nutritionalDiagnostic = await this.nutritionalDiagnosticRepo.getById(request.nutritionalDiagnosticId);
         const updatedRes = this.updatePatientDiagnosticData(nutritionalDiagnostic, request.patientDiagnosticData);
         if (updatedRes.isFailure) return left(updatedRes);
         const validationResult = await this.validatePatientDiagnosticData(nutritionalDiagnostic);
         if (validationResult.isFailure) return left(validationResult);

         await this.nutritionalDiagnosticRepo.save(nutritionalDiagnostic);
         
         return right(Result.ok(this.mapper.toResponse(nutritionalDiagnostic.getPatientData())));
      } catch (e: unknown) {
         return left(handleError(e));
      }
   }
   private updatePatientDiagnosticData(
      nutritionalDiagnostic: NutritionalDiagnostic,
      data: UpdatePatientDiagnosticDataRequest["patientDiagnosticData"],
   ): Result<ValueType> {
      try {
         if (data.anthropometricData) {
            const result = this.mergeAnthropometricData(
               nutritionalDiagnostic.getPatientData().getAnthropometricData(),
               data.anthropometricData
            );
            if (result.isFailure) return result;
            nutritionalDiagnostic.changeAnthropometricData(result.val);
         }

         if (data.clinicalData) {
            const result = this.mergeClinicalData(
               nutritionalDiagnostic.getPatientData().getClinicalSigns(),
               data.clinicalData
            );
            if (result.isFailure) return result;
            nutritionalDiagnostic.changeClinicalData(result.val);
         }

         if (data.biologicalTestResults) {
            const result = this.mergeBiologicalData(
               nutritionalDiagnostic.getPatientData().getBiologicalTestResults(),
               data.biologicalTestResults
            );
            if (result.isFailure) return result;
            nutritionalDiagnostic.changeBiologicalTestResult(result.val);
         }

         return Result.ok();
      } catch (e: unknown) {
         return handleError(e);
      }
   }

   private mergeAnthropometricData(
      existing: AnthropometricData,
      newData: { data: { code: string; value: number; unit: string }[] }
   ): Result<AnthropometricData> {
      const existingMeasures = existing.unpack().map(measure => ({
         code: measure.code.unpack(),
         value: measure.value,
         unit: measure.unit.unpack()
      }));
      const mergedMeasures = [...existingMeasures];

      // Mise à jour ou ajout des nouvelles mesures
      for (const measure of newData.data) {
         const existingIndex = mergedMeasures.findIndex(
            m => m.code === measure.code
         )

         if (existingIndex !== -1) {
            // Mise à jour
            mergedMeasures[existingIndex] = {
               code: measure.code,
               value: measure.value,
               unit: measure.unit
            };
         } else {
            // Ajout
            mergedMeasures.push({
               code: measure.code,
               value: measure.value,
               unit: measure.unit
            });
         }
      }

      return AnthropometricData.create({anthropometricMeasures: mergedMeasures})
   }

   private mergeClinicalData(
      existing: ClinicalData,
      newData: CreateClinicalData
   ): Result<ClinicalData> {
      const existingData = existing.unpack();
      const existingOtherSigns = existingData.otherSigns;

      // Gérer l'edema séparément car c'est obligatoire
      const edema = newData.edema;

      // Fusionner les autres signes cliniques
      const mergedOtherSigns = [...existingOtherSigns];
      for (const sign of newData.otherSigns) {
         const existingIndex = mergedOtherSigns.findIndex(
            s => s.unpack().code.unpack() === sign.code
         );

         if (existingIndex !== -1) {
            // Mise à jour
            const signResult = ClinicalSign.create(sign.code, sign.data);
            if (signResult.isFailure) return Result.fail(formatError(signResult,UpdatePatientDiagnosticDataUseCase.name))
            mergedOtherSigns[existingIndex] = signResult.val;
         } else {
            // Ajout
            const signResult = ClinicalSign.create(sign.code, sign.data);
            if (signResult.isFailure) return Result.fail(formatError(signResult,UpdatePatientDiagnosticDataUseCase.name))
            mergedOtherSigns.push(signResult.val);
         }
      }

      return ClinicalData.create({
         edema,
         otherSigns: mergedOtherSigns.map(s => ({
            code: s.unpack().code.unpack(),
            data: s.unpack().data
         }))
      });
   }

   private mergeBiologicalData(
      existing: BiologicalTestResult[],
      newData: CreateBiologicalTestResult[]
   ): Result<BiologicalTestResult[]> {
      const mergedResults = [...existing];

      for (const result of newData) {
         const existingIndex = mergedResults.findIndex(
            r => r.unpack().code.unpack() === result.code
         );

         const newResultOrError = BiologicalTestResult.create(result);
         if (newResultOrError.isFailure) return Result.fail(formatError(newResultOrError,UpdatePatientDiagnosticDataUseCase.name))

         if (existingIndex !== -1) {
            // Mise à jour
            mergedResults[existingIndex] = newResultOrError.val;
         } else {
            // Ajout
            mergedResults.push(newResultOrError.val);
         }
      }

      return Result.ok(mergedResults);
   }

   private async validatePatientDiagnosticData(nutritionalDiagnostic: NutritionalDiagnostic): Promise<Result<boolean>> {
      try {
         const { atInit, patientData } = nutritionalDiagnostic.getProps();
         if (!atInit) return Result.ok(true);
         const patientDataValidationResult = await this.patientValidationService.validate(patientData);
         if (patientDataValidationResult.isFailure)
            return Result.fail(formatError(patientDataValidationResult, UpdatePatientDiagnosticDataUseCase.name));
         return Result.ok(true);
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
