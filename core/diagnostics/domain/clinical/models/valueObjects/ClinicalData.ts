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

import { ArgumentNotProvidedException, formatError, Guard, handleError, Result, ValueObject } from "@shared";
import { ClinicalSign } from "./ClinicalSign";

export interface EdemaData {
   type: "Bilateral" | "Unilateral";
   godetStep: 0 | 1 | 2 | 3;
}
export interface IClinicalData {
   edema: ClinicalSign<EdemaData>;
   otherSigns: ClinicalSign<object>[];
}
export interface CreateClinicalData {
   edema: {
      code: string;
      data: EdemaData;
   };
   otherSigns: { code: string; data: object }[];
}
export class ClinicalData extends ValueObject<IClinicalData> {
   protected validate(props: Readonly<IClinicalData>): void {
      if (Guard.isEmpty(props.edema).succeeded) {
         throw new ArgumentNotProvidedException("The edema must be provide");
      }
   }
   static create(props: CreateClinicalData): Result<ClinicalData> {
      try {
         const edemaRes = ClinicalSign.create(props.edema.code, props.edema.data);
         const otherSignsRes = props.otherSigns.map((sign) => ClinicalSign.create(sign.code, sign.data));
         const combinedRes = Result.combine([edemaRes, ...otherSignsRes]);
         if (combinedRes.isFailure) return Result.fail(formatError(combinedRes, ClinicalData.name));
         return Result.ok(new ClinicalData({ edema: edemaRes.val, otherSigns: otherSignsRes.map((res) => res.val) }));
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
