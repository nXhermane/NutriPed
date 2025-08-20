import {
  AggregateID,
  ApplicationMapper,
  formatError,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@shared";
import { GenerateDiagnosticResultRequest } from "./Request";
import { GenerateDiagnosticResultResponse } from "./Response";
import {
  AnthropometricData,
  BiologicalTestResult,
  ClinicalData,
  EvaluationContext,
  INutritionalAssessmentService,
  MedicalRecordACL,
  NutritionalAssessmentResult,
  NutritionalDiagnostic,
  NutritionalDiagnosticRepository,
  PatientACL,
  PatientData,
  PatientDiagnosticData,
} from "../../../../../domain";
import { NutritionalAssessmentResultDto } from "../../../../dtos";

export class GenerateDiagnosticResultUseCase
  implements
    UseCase<GenerateDiagnosticResultRequest, GenerateDiagnosticResultResponse>
{
  constructor(
    private readonly nutritionalDiagnosticRepo: NutritionalDiagnosticRepository,
    private readonly nutritionalAssessmentService: INutritionalAssessmentService,
    private readonly medicalRecordAcl: MedicalRecordACL,
    private readonly patientAcl: PatientACL,
    private mapper: ApplicationMapper<
      NutritionalAssessmentResult,
      NutritionalAssessmentResultDto
    >
  ) {}

  async execute(
    request: GenerateDiagnosticResultRequest
  ): Promise<GenerateDiagnosticResultResponse> {
    try {
      const nutritionalDiagnostic = await this.getNutritionalDiagnostic(
        request.nutritionalDiagnosticId
      );

      const patientUpdateResult = await this.updatePatientInfo(
        nutritionalDiagnostic
      );
      if (patientUpdateResult.isFailure) return left(patientUpdateResult);

      const medicalDataUpdateResult = await this.updateMedicalData(
        nutritionalDiagnostic
      );
      if (medicalDataUpdateResult.isFailure)
        return left(medicalDataUpdateResult);

      const assessmentResult = await this.performNutritionalAssessment(
        nutritionalDiagnostic
      );
      if (assessmentResult.isFailure) return left(assessmentResult);

      nutritionalDiagnostic.saveDiagnostic(assessmentResult.val);
      await this.nutritionalDiagnosticRepo.save(nutritionalDiagnostic);

      return right(Result.ok(this.mapper.toResponse(assessmentResult.val)));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private async getNutritionalDiagnostic(diagnosticId: AggregateID) {
    return await this.nutritionalDiagnosticRepo.getByIdOrPatientId(
      diagnosticId
    );
  }

  private async updatePatientInfo(
    nutritionalDiagnostic: NutritionalDiagnostic
  ): Promise<Result<void>> {
    const patientID = nutritionalDiagnostic.getPatientId();
    const patientInfoRes = await this.patientAcl.getPatientInfo(patientID);

    if (patientInfoRes.isFailure)
      return Result.fail(
        formatError(patientInfoRes, GenerateDiagnosticResultUseCase.name)
      );
    if (patientInfoRes.val === null) {
      return Result.fail("Patient not found to generate the diagnostic.");
    }

    nutritionalDiagnostic.changeBirthDay(patientInfoRes.val.birthday);
    nutritionalDiagnostic.changeGender(patientInfoRes.val.gender);

    return Result.ok();
  }

  private async updateMedicalData(
    nutritionalDiagnostic: NutritionalDiagnostic
  ): Promise<Result<void>> {
    const patientID = nutritionalDiagnostic.getPatientId();
    const medicalRecordDataRes = await this.medicalRecordAcl.getPatientData({
      patientId: patientID,
    });

    if (medicalRecordDataRes.isFailure)
      return Result.fail(
        formatError(medicalRecordDataRes, GenerateDiagnosticResultUseCase.name)
      );

    const medicalDataResult = this.createMedicalDataObjects(
      medicalRecordDataRes.val
    );
    if (medicalDataResult.isFailure)
      return Result.fail(formatError(medicalDataResult));
    const { anthropometric, clinical, biological } = medicalDataResult.val;

    nutritionalDiagnostic.changeAnthropometricData(anthropometric);
    nutritionalDiagnostic.changeClinicalData(clinical);
    nutritionalDiagnostic.changeBiologicalTestResult(biological);

    return Result.ok();
  }

  private createMedicalDataObjects(medicalData: PatientData): Result<{
    anthropometric: AnthropometricData;
    clinical: ClinicalData;
    biological: BiologicalTestResult[];
  }> {
    const anthropometric = AnthropometricData.create({
      anthropometricMeasures: medicalData.anthroData,
    });

    const clinical = ClinicalData.create({
      clinicalSigns: medicalData.clinicalData,
    });

    const biological = medicalData.biologicalData.map((val: any) =>
      BiologicalTestResult.create(val)
    );

    const combinedRes = Result.combine([
      anthropometric,
      clinical,
      ...biological,
    ]);
    if (combinedRes.isFailure)
      return Result.fail(
        formatError(combinedRes, GenerateDiagnosticResultUseCase.name)
      );

    return Result.ok({
      anthropometric: anthropometric.val,
      clinical: clinical.val,
      biological: biological.map(res => res.val),
    });
  }

  private async performNutritionalAssessment(
    nutritionalDiagnostic: NutritionalDiagnostic
  ): Promise<Result<NutritionalAssessmentResult>> {
    const patientData = nutritionalDiagnostic.getPatientData();
    const context = this.generateEvaluationContext(patientData);

    return await this.nutritionalAssessmentService.evaluateNutritionalStatus(
      context,
      patientData.getAnthropometricData(),
      patientData.getClinicalSigns(),
      patientData.getBiologicalTestResults()
    );
  }

  private generateEvaluationContext(
    patientData: PatientDiagnosticData
  ): EvaluationContext {
    return {
      age_in_day: patientData.age_in_day,
      age_in_month: patientData.age_in_month,
      age_in_year: patientData.age_in_year,
      sex: patientData.getGender().unpack(),
    };
  }
}
