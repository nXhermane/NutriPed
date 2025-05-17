import { ConditionResult } from "smartcal";
import { AnthroSystemCodes, CLINICAL_SIGNS, BIOCHEMICAL_REF_CODES, COMPLICATION_CODES } from "../../../../../constants";
import { APPETITE_TEST_CODES, APPETITE_TEST_RESULT_CODES } from "../../../modules";
import { AggregateID, DomainDate, Entity, EntityPropsBaseType, handleError, Result } from "@shared";

export type ValueType<T> = {
   value: T;
   code: string;
   date: DomainDate;
};
export interface IPatientCurrentState extends EntityPropsBaseType {
   anthropometricData: Record<(typeof AnthroSystemCodes)[keyof typeof AnthroSystemCodes], ValueType<number>>;
   clinicalSignData: Record<(typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS], ValueType<(typeof ConditionResult)[keyof typeof ConditionResult]>>;
   biologicalData: Record<(typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES], ValueType<number>>;
   appetiteTestResult: { [APPETITE_TEST_CODES.CODE]: ValueType<APPETITE_TEST_RESULT_CODES> };
   complicationData: Record<string, ValueType<(typeof ConditionResult)[keyof typeof ConditionResult]>>;
}

export interface CreateCurrentStateProps {
   anthropometricData: Record<(typeof AnthroSystemCodes)[keyof typeof AnthroSystemCodes], number>;
   clinicalSignData: Record<(typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS], (typeof ConditionResult)[keyof typeof ConditionResult]>;
   biologicalData: Record<(typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES], number>;
   appetiteTestResult: { [APPETITE_TEST_CODES.CODE]: APPETITE_TEST_RESULT_CODES };
   complicationData: Record<string, (typeof ConditionResult)[keyof typeof ConditionResult]>;
}

export class PatientCurrentState extends Entity<IPatientCurrentState> {
   addAnthropometricData(code: AnthroSystemCodes, value: number, date: DomainDate) {
      this.props.anthropometricData[code] = { value, date, code };
      this.validate();
   }
   addBiologicalData(code: (typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES], value: number, date: DomainDate) {
      this.props.biologicalData[code] = { code, value, date };
   }
   addClinicalSignData(
      code: (typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS],
      value: (typeof ConditionResult)[keyof typeof ConditionResult],
      date: DomainDate,
   ) {
      this.props.clinicalSignData[code] = { code, value, date };
   }
   addAppetiteTestResult(code: string, value: APPETITE_TEST_RESULT_CODES, date: DomainDate) {
      this.props.appetiteTestResult[code] = { code, value, date };
   }
   addComplication(code: string, value: number, date: DomainDate) {
      this.props.complicationData[code] = { code, value, date };
   }
  
   getAnthroVariables(): Record<string, number> {
      return Object.fromEntries(Object.values(this.props.anthropometricData).map((value) => [value.code, value.value]));
   }
   getClinicalVariables(): Record<string, number> {
      return Object.fromEntries(Object.values(this.props.clinicalSignData).map((value) => [value.code, value.value]));
   }
   getBiologicalVariables(): Record<string, number> {
      return Object.fromEntries(Object.values(this.props.biologicalData).map((value) => [value.code, value.value]));
   }
   getAppetiteTestVariables(): Record<string, APPETITE_TEST_RESULT_CODES> {
      return Object.fromEntries(Object.values(this.props.appetiteTestResult).map((value) => [value.code, value.value]));
   }
   getComplicationVariables(): Record<string, (typeof ConditionResult)[keyof typeof ConditionResult]> {
      return {
         [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: Object.values(this.props.complicationData).reduce(
            (complication_number: number, currentComplication: ValueType<number>) =>
               currentComplication.value === ConditionResult.True ? complication_number + 1 : complication_number,
            0,
         ),
      };
   }
   public validate(): void {
      this._isValid = false;
      // No validation rule for beta version
      this._isValid = true;
   }

   static create(createProps: CreateCurrentStateProps, id: AggregateID): Result<PatientCurrentState> {
      try {
         const date = new DomainDate();
         const anthropometricData = Object.fromEntries(
            Object.keys(createProps.anthropometricData).map((key) => [
               key,
               { value: createProps.anthropometricData[key as AnthroSystemCodes], code: key, date },
            ]),
         );
         const clinicalSignData = Object.fromEntries(
            Object.keys(createProps.clinicalSignData).map((key) => [
               key,
               { value: createProps.clinicalSignData[key as (typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS]], code: key, date },
            ]),
         );
         const biologicalData = Object.fromEntries(
            Object.keys(createProps.biologicalData).map((key) => [
               key,
               { value: createProps.biologicalData[key as (typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES]], code: key, date },
            ]),
         );
         const appetiteTestData = Object.fromEntries(
            Object.keys(createProps.appetiteTestResult).map((key) => [key, { value: createProps.appetiteTestResult[key], code: key, date }]),
         );
         const complicationData = Object.fromEntries(
            Object.keys(createProps.complicationData).map((key) => [key, { value: createProps.complicationData[key], code: key, date }]),
         );

         return Result.ok(
            new PatientCurrentState({
               id,
               props: {
                  anthropometricData: anthropometricData as Record<(typeof AnthroSystemCodes)[keyof typeof AnthroSystemCodes], ValueType<number>>,
                  clinicalSignData: clinicalSignData as Record<
                     (typeof CLINICAL_SIGNS)[keyof typeof CLINICAL_SIGNS],
                     ValueType<(typeof ConditionResult)[keyof typeof ConditionResult]>
                  >,
                  biologicalData: biologicalData as Record<(typeof BIOCHEMICAL_REF_CODES)[keyof typeof BIOCHEMICAL_REF_CODES], ValueType<number>>,
                  appetiteTestResult: appetiteTestData,
                  complicationData: complicationData,
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
