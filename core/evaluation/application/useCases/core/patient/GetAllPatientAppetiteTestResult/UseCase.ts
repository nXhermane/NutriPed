import {
  AggregateID,
  DomainDate,
  formatError,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetAllPatientAppetiteTestResultRequest } from "./Request";
import { GetAllPatientAppetiteTestResultResponse } from "./Response";
import {
  EvaluateAppetiteRequest,
  EvaluateAppetiteResponse,
} from "../../../appetite_test";
import {
  AclAppetiteTestData,
  AnthroSystemCodes,
  MedicalRecordACL,
} from "@/core/evaluation/domain";
import {
  NormalizeAnthropometricDataRequest,
  NormalizeAnthropometricDataResponse,
} from "../../../anthropometric";

export class GetAllPatientAppetiteTestResultUseCase
  implements
    UseCase<
      GetAllPatientAppetiteTestResultRequest,
      GetAllPatientAppetiteTestResultResponse
    >
{
  constructor(
    private readonly evaluateAppetiteUC: UseCase<
      EvaluateAppetiteRequest,
      EvaluateAppetiteResponse
    >,
    private readonly medicalRecordACL: MedicalRecordACL,
    private readonly normalizeAnthropometricUC: UseCase<
      NormalizeAnthropometricDataRequest,
      NormalizeAnthropometricDataResponse
    >
  ) {}
  async execute(
    request: GetAllPatientAppetiteTestResultRequest
  ): Promise<GetAllPatientAppetiteTestResultResponse> {
    try {
      const appetiteTestData = await this.getAppetiteTestData(
        request.patientId
      );
      const appetiteTestDataEvaluationResults = await Promise.all(
        appetiteTestData.map(testData =>
          this.evaluatePatientAppetiteTest(testData, request.patientId)
        )
      );
      return right(Result.ok(appetiteTestDataEvaluationResults));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private async evaluatePatientAppetiteTest(
    appetiteTest: AclAppetiteTestData,
    patientId: AggregateID
  ) {
    const domainDateRes = DomainDate.create(appetiteTest.recordedAt);
    if (domainDateRes.isFailure) {
      throw new Error(formatError(domainDateRes));
    }
    const patientWeight = await this.getPatientNormalizedWeightAtDate(
      patientId,
      domainDateRes.val
    );
    return this.evaluateAppetiteTest(appetiteTest, patientWeight);
  }
  private async getAppetiteTestData(patientId: AggregateID) {
    const appetiteTestDataRes =
      await this.medicalRecordACL.getAllAppetiteTestData({ patientId });
    if (appetiteTestDataRes.isFailure) {
      throw new Error("Failed to get appetite test data");
    }
    return appetiteTestDataRes.val;
  }

  private async getPatientNormalizedWeightAtDate(
    patientId: AggregateID,
    date: DomainDate
  ): Promise<number> {
    const patientDataRes = await this.medicalRecordACL.getPatientDataBefore({
      patientId,
      date,
    });
    if (patientDataRes.isFailure) {
      throw new Error("Failed to get patient data");
    }

    const weightData = patientDataRes.val.anthroData.find(
      anthrop => anthrop.code === AnthroSystemCodes.WEIGHT
    );
    if (!weightData) {
      throw new Error("Patient weight not found");
    }

    const normalizeResult = await this.normalizeAnthropometricUC.execute({
      anthropometricMeasures: [weightData],
    });
    if (!normalizeResult.isRight()) {
      throw new Error("Failed to normalize weight data");
    }
    if (normalizeResult.value.val.length === 0) {
      throw new Error("Failed to normalize weight data");
    }

    return normalizeResult.value.val[0].value;
  }

  private async evaluateAppetiteTest(
    testData: AclAppetiteTestData,
    weight: number
  ) {
    const evaluationRes = await this.evaluateAppetiteUC.execute({
      givenProductType: testData.productType,
      patientWeight: weight,
      takenAmount:
        "fraction" in testData.amount
          ? { takenFraction: testData.amount.fraction }
          : { takenQuantity: testData.amount.quantity },
    });

    if (!evaluationRes.isRight()) {
      throw new Error("Failed to evaluate appetite test");
    }

    return { ...evaluationRes.value.val, id: testData.id };
  }
}
