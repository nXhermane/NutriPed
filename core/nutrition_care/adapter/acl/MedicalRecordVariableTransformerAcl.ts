import {
  AggregateID,
  DomainDateTime,
  Gender,
  handleError,
  Result,
  Sex,
  SystemCode,
  Birthday,
  ConditionResult,
  formatError,
} from "@/core/shared";
import { NextCore } from "../../domain";
import { IPatientService } from "@/core/patient";
import {
  GetLastestValuesUnitlDateDto,
  IMedicalRecordService,
  MedicalRecordDto,
} from "@/core/medical_record";
import {
  AnthroSystemCodes,
  DAY_IN_MONTHS,
  GrowthIndicatorValueDto,
  IGrowthIndicatorValueAppService,
  INormalizeDataAppService,
} from "@/core/evaluation";
import {
  COMPLICATION_CODES,
  ConsecutiveVariable,
  consecutiveVariable,
} from "@/core/constants";
export type PatientInfo = {
  [AnthroSystemCodes.SEX]: Sex;
  [AnthroSystemCodes.AGE_IN_DAY]: number;
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
};
export interface MedicalRecordVariableTransformerACLServices {
  patientService: IPatientService;
  medicalRecordService: IMedicalRecordService;
  growthIndicatorValuesService: IGrowthIndicatorValueAppService;
  normalizeData: INormalizeDataAppService;
}
export class MedicalRecordVariableTransformerAclImpl
  implements NextCore.MedicalRecordVariableTransformerAcl
{
  constructor(
    private readonly services: MedicalRecordVariableTransformerACLServices
  ) {}
  async getVariableByDate(
    patientId: AggregateID,
    date: DomainDateTime
  ): Promise<Result<NextCore.MedicalRecordVariables>> {
    try {
      const patientInfoRes = await this.getPatientInfo(patientId);
      const latestMeasurementRes = await this.getLatestMeasurmentUntilDate(
        patientId,
        date
      );
      const combinedRes = Result.combine([
        patientInfoRes,
        latestMeasurementRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, MedicalRecordVariableTransformerAclImpl.name)
        );
      }
      const growthIndicatorRes = await this.computeGrowthIndicatorValues(
        patientInfoRes.val,
        latestMeasurementRes.val.anthropometric
      );
      if (growthIndicatorRes.isFailure) {
        return Result.fail(
          formatError(
            growthIndicatorRes,
            MedicalRecordVariableTransformerAclImpl.name
          )
        );
      }
      return this.computeAllAsVariables(
        patientInfoRes.val,
        latestMeasurementRes.val,
        growthIndicatorRes.val
      );
    } catch (e) {
      return handleError(e);
    }
  }
  async getConsecutiveVariable<T extends string>(
    patientId: AggregateID,
    code: SystemCode<T>,
    type: NextCore.ConsecutiveVariableType,
    counter: number
  ): Promise<Result<Record<ConsecutiveVariable<T>, number>>> {
    try {
      const medicalRecordDtoRes = await this.getMedicalRecordData(patientId);
      if (medicalRecordDtoRes.isFailure) {
        return Result.fail(
          formatError(
            medicalRecordDtoRes,
            MedicalRecordVariableTransformerAclImpl.name
          )
        );
      }

      return this.getConsecutiveDataArrayByType(
        medicalRecordDtoRes.val,
        code.unpack(),
        type,
        counter
      );
    } catch (e) {
      return handleError(e);
    }
  }

  private async getConsecutiveDataArrayByType<T extends string>(
    medicalRecord: MedicalRecordDto,
    code: T,
    type: NextCore.ConsecutiveVariableType,
    counter: number
  ): Promise<Result<Record<ConsecutiveVariable<T>, number>>> {
    try {
      switch (type) {
        case NextCore.ConsecutiveVariableType.ANTHROP: {
          const filteredArray = medicalRecord.anthropometricData.filter(
            item => item.code === code
          );
          if (filteredArray.length === 0) {
            return Result.fail(`The consecutive value of ${code} not found.`);
          }
          const sortedArray = this.sortValues(filteredArray);
          const normalizedArrayRes =
            await this.normalizeAnthropometricDataSequential(sortedArray);
          if (normalizedArrayRes.isFailure) {
            return Result.fail(formatError(normalizedArrayRes));
          }
          const normalizedArray = normalizedArrayRes.val;

          const consecutiveVariables: Record<
            ConsecutiveVariable<T>,
            number
          > = {} as Record<ConsecutiveVariable<T>, number>;
          for (let i = 0; i < counter && i < normalizedArray.length; i++) {
            const currentValue = normalizedArray[i];
            consecutiveVariables[consecutiveVariable(code, i)] =
              currentValue.value;
          }
          return Result.ok(consecutiveVariables);
        }
        case NextCore.ConsecutiveVariableType.CLINICAL: {
          const filteredArray = medicalRecord.clinicalData.filter(
            item => item.code === code
          );
          if (filteredArray.length === 0) {
            return Result.fail(`The consecutive value of ${code} not found.`);
          }
          const sortedArray = this.sortValues(filteredArray);

          const consecutiveVariables: Record<
            ConsecutiveVariable<T>,
            number
          > = {} as Record<ConsecutiveVariable<T>, number>;
          for (let i = 0; i < counter && i < sortedArray.length; i++) {
            const currentValue = sortedArray[i];
            consecutiveVariables[consecutiveVariable(code, i)] =
              currentValue.isPresent
                ? ConditionResult.True
                : ConditionResult.False;
          }
          return Result.ok(consecutiveVariables);
        }
        case NextCore.ConsecutiveVariableType.DATA_FIELD: {
          const filteredArray = medicalRecord.dataFieldResponse.filter(
            item => item.code === code
          );
          if (filteredArray.length === 0) {
            return Result.fail(`The consecutive value of ${code} not found.`);
          }
          const sortedArray = this.sortValues(filteredArray);
          const consecutiveVariables: Record<
            ConsecutiveVariable<T>,
            number
          > = {} as Record<ConsecutiveVariable<T>, number>;
          for (let i = 0; i < counter && i < sortedArray.length; i++) {
            const currentValue = sortedArray[i];
            consecutiveVariables[consecutiveVariable(code, i)] =
              currentValue.data as number;
          }
          return Result.ok(consecutiveVariables);
        }
        case NextCore.ConsecutiveVariableType.BIOLOGICAL: {
          const filteredArray = medicalRecord.biologicalData.filter(
            item => item.code === code
          );
          if (filteredArray.length === 0) {
            return Result.fail(`The consecutive value of ${code} not found.`);
          }
          const sortedArray = this.sortValues(filteredArray);
          const consecutiveVariables: Record<
            ConsecutiveVariable<T>,
            number
          > = {} as Record<ConsecutiveVariable<T>, number>;
          for (let i = 0; i < counter && i < sortedArray.length; i++) {
            const currentValue = sortedArray[i];
            consecutiveVariables[consecutiveVariable(code, i)] =
              currentValue.value;
          }
          return Result.ok(consecutiveVariables);
        }
        default: {
          return Result.fail(`The consecutive value type not supported`);
        }
      }
    } catch (e) {
      return handleError(e);
    }
  }
  private sortValues<T extends { code: string; recordedAt: string }>(
    array: T[]
  ): T[] {
    return array.sort((a, b) => {
      const aDate = new DomainDateTime(a.recordedAt);
      const bDate = new DomainDateTime(b.recordedAt);
      return bDate.getTimestamp() - aDate.getTimestamp();
    });
  }
  private async getMedicalRecordData(
    patientId: AggregateID
  ): Promise<Result<MedicalRecordDto>> {
    try {
      const medicalRecordDataResponse =
        await this.services.medicalRecordService.get({
          patientOrMedicalRecordId: patientId,
        });
      if ("content" in medicalRecordDataResponse) {
        return Result.fail(JSON.parse(medicalRecordDataResponse.content));
      }
      return Result.ok(medicalRecordDataResponse.data);
    } catch (e) {
      return handleError(e);
    }
  }
  private computeAllAsVariables(
    patientInfo: PatientInfo,
    latestMeasurement: GetLastestValuesUnitlDateDto,
    growthIndicators: GrowthIndicatorValueDto[]
  ): Result<Record<string, number | string>> {
    try {
      const anthroVariablesRes = this.computeAnthropometricVariables(
        latestMeasurement.anthropometric
      );
      const growthIndicatorVariablesRes =
        this.computeGrowthIndicatorVariables(growthIndicators);
      const clinicalVariablesRes = this.computeClinicalVariables(
        latestMeasurement.clinical
      );
      const complicationVariablesRes = this.computeComplicationVariables(
        latestMeasurement.complication
      );
      const appetiteTestVariablesRes = this.computeAppetiteTestVariables(
        latestMeasurement.appetiteTest
      );
      const combinedRes = Result.combine([
        anthroVariablesRes,
        growthIndicatorVariablesRes,
        clinicalVariablesRes,
        complicationVariablesRes,
        appetiteTestVariablesRes,
      ]);
      if (combinedRes.isFailure) {
        return Result.fail(
          formatError(combinedRes, MedicalRecordVariableTransformerAclImpl.name)
        );
      }
      return Result.ok({
        ...anthroVariablesRes.val,
        ...growthIndicatorVariablesRes.val,
        ...clinicalVariablesRes.val,
        ...complicationVariablesRes.val,
        ...appetiteTestVariablesRes.val,
      });
    } catch (e) {
      return handleError(e);
    }
  }

  private computeAnthropometricVariables(
    anthropometic: GetLastestValuesUnitlDateDto["anthropometric"]
  ): Result<Record<string, number>> {
    try {
      return Result.ok(
        anthropometic.reduce<Record<string, number>>((acc, curr) => {
          acc[curr.code] = curr.value;
          return acc;
        }, {})
      );
    } catch (e) {
      return handleError(e);
    }
  }
  private computeGrowthIndicatorVariables(
    growthIndicators: GrowthIndicatorValueDto[]
  ): Result<Record<string, number>> {
    try {
      return Result.ok(
        growthIndicators.reduce<Record<string, number>>((acc, curr) => {
          acc[curr.code] = curr.value;
          return acc;
        }, {})
      );
    } catch (e) {
      return handleError(e);
    }
  }
  private computeClinicalVariables(
    clinical: GetLastestValuesUnitlDateDto["clinical"]
  ): Result<Record<string, number>> {
    try {
      return Result.ok(
        clinical.reduce<Record<string, number>>((acc, curr) => {
          acc[curr.code] = curr.isPresent
            ? ConditionResult.True
            : ConditionResult.False;
          return acc;
        }, {})
      );
    } catch (e) {
      return handleError(e);
    }
  }
  private computeAppetiteTestVariables(
    appetiteTest: GetLastestValuesUnitlDateDto["appetiteTest"]
  ): Result<Record<string, string>> {
    try {
      return Result.ok({
        [appetiteTest.code]: appetiteTest.result,
      });
    } catch (e) {
      return handleError(e);
    }
  }
  private computeComplicationVariables(
    complication: GetLastestValuesUnitlDateDto["complication"]
  ): Result<Record<string, number>> {
    try {
      const filtered = complication.filter(item => item.isPresent);
      return Result.ok({
        [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: filtered.length,
        ...filtered.reduce<Record<string, number>>((acc, item) => {
          acc[item.code] = item.isPresent
            ? ConditionResult.True
            : ConditionResult.False;
          return acc;
        }, {}),
      });
    } catch (e) {
      return handleError(e);
    }
  }
  private async computeGrowthIndicatorValues(
    patientInfo: PatientInfo,
    anthropometricData: GetLastestValuesUnitlDateDto["anthropometric"]
  ): Promise<Result<GrowthIndicatorValueDto[]>> {
    try {
      const growthIndicatorResponse =
        await this.services.growthIndicatorValuesService.calculateAllAvailableIndicator(
          {
            ...patientInfo,
            anthropometricData: {
              anthropometricMeasures: anthropometricData,
            },
          }
        );
      if ("content" in growthIndicatorResponse) {
        return Result.fail(JSON.parse(growthIndicatorResponse.content));
      }
      return Result.ok(growthIndicatorResponse.data);
    } catch (e) {
      return handleError(e);
    }
  }
  private async getLatestMeasurmentUntilDate(
    patientId: AggregateID,
    date: DomainDateTime
  ): Promise<Result<GetLastestValuesUnitlDateDto>> {
    try {
      const latestValuesResponse =
        await this.services.medicalRecordService.getLatestValuesUntilDate({
          patientOrMedicalRecordId: patientId,
          datetime: date.toString(),
        });
      if ("content" in latestValuesResponse) {
        const _errorContent = JSON.parse(latestValuesResponse.content);
        return Result.fail(_errorContent);
      }
      return Result.ok(latestValuesResponse.data);
    } catch (e) {
      return handleError(e);
    }
  }
  private async getPatientInfo(
    patientId: AggregateID
  ): Promise<Result<PatientInfo>> {
    try {
      const patientResponse = await this.services.patientService.get({
        id: patientId,
      });
      if ("data" in patientResponse) {
        const patient = patientResponse.data[0];
        if (patient === undefined) {
          return Result.fail("Patient not found");
        }
        const gender = new Gender(patient.gender as Sex);
        const birthDate = new Birthday(patient.birthday);
        return Result.ok({
          [AnthroSystemCodes.SEX]: gender.sex as Sex,
          [AnthroSystemCodes.AGE_IN_DAY]: birthDate.getAgeInDays(),
          [AnthroSystemCodes.AGE_IN_MONTH]:
            birthDate.getAgeInDays() / DAY_IN_MONTHS,
        });
      }
      const _error = JSON.parse(patientResponse.content);
      return Result.fail(_error);
    } catch (e) {
      return handleError(e);
    }
  }
  private async normalizeAnthropometricDataSequential(
    sortedData: MedicalRecordDto["anthropometricData"]
  ): Promise<Result<{ code: string; value: number; unit: string }[]>> {
    try {
      const normalizedResults = [];

      for (let i = 0; i < sortedData.length; i++) {
        const item = sortedData[i];

        try {
          const normalizeResult =
            await this.services.normalizeData.normalizeAnthropometricData({
              anthropometricMeasures: [item],
            });

          if ("content" in normalizeResult) {
            console.warn(
              `Failed to normalize item at index ${i}:`,
              normalizeResult.content
            );
            normalizedResults.push(item); // Garder l'original
          } else {
            const normalizedItem = normalizeResult.data[0];
            normalizedResults.push(normalizedItem || item);
          }
        } catch (itemError) {
          console.warn(`Error normalizing item at index ${i}:`, itemError);
          normalizedResults.push(item);
        }
      }
      return Result.ok(normalizedResults);
    } catch (error) {
      return handleError(error);
    }
  }
}
