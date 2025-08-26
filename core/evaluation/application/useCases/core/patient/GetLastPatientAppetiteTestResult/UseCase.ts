import {
  AggregateID,
  handleError,
  left,
  Result,
  right,
  UseCase,
} from "@/core/shared";
import { GetLastPatientAppetiteTestResultRequest } from "./Request";
import { GetLastPatientAppetiteTestResultResponse } from "./Response";
import {
  EvaluateAppetiteRequest,
  EvaluateAppetiteResponse,
} from "../../../appetite_test";
import { AnthroSystemCodes, MedicalRecordACL } from "@/core/evaluation/domain";
import {
  NormalizeAnthropometricDataRequest,
  NormalizeAnthropometricDataResponse,
} from "../../../anthropometric";

export class GetLastPatientAppetiteTestResultUseCase {
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
    request: GetLastPatientAppetiteTestResultRequest
  ): Promise<GetLastPatientAppetiteTestResultResponse> {
    try {
      const lastAppetiteTestData = await this.getLastAppetiteTestData(
        request.patientId
      );
      const patientWeight = await this.getPatientNormalizedWeight(
        request.patientId
      );
      const evaluationResult = await this.evaluateAppetiteTest(
        lastAppetiteTestData,
        patientWeight
      );

      return right(Result.ok(evaluationResult));
    } catch (e: unknown) {
      return left(handleError(e));
    }
  }

  private async getLastAppetiteTestData(patientId: AggregateID) {
    const appetiteTestDataRes =
      await this.medicalRecordACL.getAllAppetiteTestData({ patientId });
    if (appetiteTestDataRes.isFailure) {
      throw new Error("Failed to get appetite test data");
    }
    return appetiteTestDataRes.val[0];
  }

  private async getPatientNormalizedWeight(
    patientId: AggregateID
  ): Promise<number> {
    const patientDataRes = await this.medicalRecordACL.getPatientData({
      patientId,
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

  private async evaluateAppetiteTest(testData: any, weight: number) {
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

    return evaluationRes.value.val;
  }
}
