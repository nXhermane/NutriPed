/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @fileoverview Service responsible for validating clinical data against defined standards.
 *
 * @class ClinicalValidationService
 * @implements IClinicalValidationService
 *
 * Key responsibilities:
 * - Validates completeness of clinical observations
 * - Ensures all required data points are present
 * - Verifies data format and ranges
 * - Cross-references with clinical sign definitions
 */

import { formatError, handleError, Result } from "@shared";
import { ValidateResult } from "../../common";
import {
  ClinicalData,
  ClinicalDataType,
  ClinicalSign,
  ClinicalSignReference,
  IClinicalSignReference,
} from "../models";
import {
  ClinicalSignReferenceRepository,
  IClinicalValidationService,
} from "../ports";
import { CLINICAL_ERRORS, handleClinicalError } from "../errors";

export class ClinicalValidationService implements IClinicalValidationService {
  constructor(
    private readonly clinicalSignRepo: ClinicalSignReferenceRepository
  ) {}

  async validate(clinicalData: ClinicalData): Promise<Result<ValidateResult>> {
    try {
      const signs = this.extractClinicalSigns(clinicalData);
      const validationResult = await this.validateSignsData(signs);
      if (validationResult.isFailure) {
        return handleClinicalError(
          CLINICAL_ERRORS.VALIDATION.INVALID_DATA.path,
          formatError(validationResult, ClinicalValidationService.name)
        ) as Result<ValidateResult>;
      }
      return Result.ok({ isValid: true });
    } catch (e: unknown) {
      return handleError(e);
    }
  }

  private extractClinicalSigns(data: ClinicalData): ClinicalSign<any>[] {
    return data.unpack().clinicalSigns;
  }

  private async validateSignsData(
    signs: ClinicalSign<any>[]
  ): Promise<Result<void>> {
    try {
      const references = await this.getClinicalReferences(signs);
      return this.validateRequiredData(signs, references);
    } catch (e: unknown) {
      return handleClinicalError(
        CLINICAL_ERRORS.REPOSITORY.REFERENCE_NOT_FOUND.path,
        `Failed to fetch clinical references : [Error]:${e}`
      ) as Result<void>;
    }
  }

  private async getClinicalReferences(
    signs: ClinicalSign<any>[]
  ): Promise<ClinicalSignReference[]> {
    return Promise.all(
      signs.map(sign => this.clinicalSignRepo.getByCode(sign.unpack().code))
    );
  }

  private validateRequiredData(
    signs: ClinicalSign<any>[],
    references: ClinicalSignReference[]
  ): Result<void> {
    try {
      for (const clinicalRef of references) {
        const clinicalSignData = signs.find(sign =>
          sign.unpack().code.equals(clinicalRef.getProps().code)
        );

        if (!clinicalSignData) {
          return handleClinicalError(
            CLINICAL_ERRORS.VALIDATION.MISSING_DATA.path,
            `Missing clinical sign data for ${clinicalRef.getCode()}`
          ) as Result<void>;
        }

        const clinicalRefNeedData = clinicalRef.getClinicalSignData();
        const clinicalDataProvided = Object.keys(
          clinicalSignData.unpack().data
        );
        if (
          !clinicalRefNeedData.every(clinicalNeeded =>
            clinicalDataProvided.includes(clinicalNeeded.code.unpack())
          )
        ) {
          return handleClinicalError(
            CLINICAL_ERRORS.VALIDATION.MISSING_DATA.path,
            `Incomplete clinical data for ${clinicalRef.getCode()}`
          ) as Result<void>;
        }
        const typeValidationResult = this.validateRequiredDataType(
          clinicalSignData,
          clinicalRef.getProps()
        );
        if (typeValidationResult.isFailure)
          return Result.fail(
            formatError(typeValidationResult, ClinicalValidationService.name)
          );
      }
      return Result.ok();
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  /**
   *
   * @param sign
   * @param ref
   * @returns
   * @pre La validation des codes dois etre fait avant l'appelle de cette function pour assurer un fonctionnement sans probleme
   */
  private validateRequiredDataType(
    sign: ClinicalSign<any>,
    ref: IClinicalSignReference
  ): Result<boolean> {
    try {
      const signData = sign.unpack().data;
      const clinicalSignRefData = ref.data;
      for (const clinicalSignRefDataEntry of clinicalSignRefData) {
        const dataCode = clinicalSignRefDataEntry.unpack().code.unpack();
        const dataType = clinicalSignRefDataEntry.unpack().dataType;
        const dataTypeRange = clinicalSignRefDataEntry.unpack().dataRange;
        const signDataValue = signData[dataCode]!;
        let validationResult: boolean = false;

        switch (dataType) {
          case ClinicalDataType.BOOL:
            validationResult = typeof signDataValue === "boolean";
            break;
          case ClinicalDataType.INT:
            validationResult = typeof signDataValue === "number";
            break;
          case ClinicalDataType.STR:
            validationResult = typeof signDataValue === "string";
            break;
          case ClinicalDataType.RANGE:
            {
              const isNumber = typeof signDataValue === "number";
              const inRange =
                (dataTypeRange as [number, number])[0] <= signDataValue &&
                (dataTypeRange as [number, number])[1] >= signDataValue;
              validationResult = isNumber && inRange;
            }
            break;
          default: {
            throw new Error("This data type is not supported.");
          }
        }
        if (!validationResult) {
          return handleClinicalError(
            CLINICAL_ERRORS.VALIDATION.INVALID_DATA_TYPE.path,
            `Type : ${dataType} , Value: ${signDataValue} ${dataTypeRange ?? "Range : " + dataTypeRange}`
          ) as Result<boolean>;
        }
      }
      return Result.ok(true);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
