/**
 * @fileoverview Value object representing clinical observation data for a patient.
 *
 * Key components:
 * @interface EdemaData - Structure for edema-specific observations
 * - type: Classification of edema (Bilateral/Unilateral)
 * - godetStep: Severity measure (0-3)
 *
 * @interface IClinicalData - Complete clinical data structure
 * - edema: Required edema assessment
 * - otherSigns: Additional clinical observations
 */

import { formatError, handleError, Result, ValueObject } from "@shared";
import { ClinicalSign } from "./ClinicalSign";

export interface IClinicalData {
  clinicalSigns: ClinicalSign<object>[];
}
export interface CreateClinicalData {
  clinicalSigns: { code: string; data: object }[];
}
export class ClinicalData extends ValueObject<IClinicalData> {
  protected validate(props: Readonly<IClinicalData>): void {}
  static create(props: CreateClinicalData): Result<ClinicalData> {
    try {
      const clinicalSignRes = props.clinicalSigns.map(sign =>
        ClinicalSign.create(sign.code, sign.data)
      );
      const combinedRes = Result.combine(clinicalSignRes);
      if (combinedRes.isFailure)
        return Result.fail(formatError(combinedRes, ClinicalData.name));
      return Result.ok(
        new ClinicalData({
          clinicalSigns: clinicalSignRes.map(res => res.val),
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
