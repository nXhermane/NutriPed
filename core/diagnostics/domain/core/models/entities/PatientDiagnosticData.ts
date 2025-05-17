import {
   AggregateID,
   ArgumentInvalidException,
   ArgumentOutOfRangeException,
   Birthday,
   Entity,
   EntityPropsBaseType,
   Gender,
   handleError,
   Result,
   Sex,
} from "@shared";
import { AnthropometricData, DAY_IN_MONTHS, DAY_IN_YEARS, MAX_AGE_IN_PEDIATRIC, CreateAnthropometricData } from "../../../anthropometry";
import { BiologicalTestResult, CreateBiologicalTestResult } from "../../../biological";
import { ClinicalData, CreateClinicalData } from "../../../clinical";



export interface IPatientDiagnosticData extends EntityPropsBaseType {
   gender: Gender;
   birthday: Birthday;
   anthropMeasures: AnthropometricData;
   clinicalSigns: ClinicalData;
   biologicalTestResults: BiologicalTestResult[];
}
export type CreatePatientDiagnosticData = {
   sex: `${Sex}`;
   birthday: string;
   anthropometricData: CreateAnthropometricData;
   clinicalSigns: CreateClinicalData
   biologicalTestResults: CreateBiologicalTestResult[];
};

export class PatientDiagnosticData extends Entity<IPatientDiagnosticData> {
   get age_in_month(): number {
      return this.props.birthday.getAgeInDays() / DAY_IN_MONTHS;
   }
   get age_in_year(): number {
      return this.props.birthday.getAgeInDays() / DAY_IN_YEARS;
   }
   get age_in_day(): number {
      return this.props.birthday.getAgeInDays();
   }
   get sex(): Sex {
      return this.props.gender.sex as Sex;
   }
   getAnthropometricData(): AnthropometricData {
      return this.props.anthropMeasures;
   }
   getClinicalSigns(): ClinicalData {
      return this.props.clinicalSigns;
   }
   getBiologicalTestResults(): BiologicalTestResult[] {
      return this.props.biologicalTestResults;
   }
   getGender(): Gender {
      return this.props.gender;
   }
   getBirthDay(): Birthday {
      return this.props.birthday;
   }
   changeGender(gender: Gender) {
      this.props.gender = gender;
      this.validate();
   }
   changeBirthDay(birthday: Birthday) {
      this.props.birthday = birthday;
      this.validate();
   }
   changeAnthropometricData(anthropMeasures: AnthropometricData) {
      this.props.anthropMeasures = anthropMeasures;
      this.validate();
   }
   changeClinicalSigns(clinicalData: ClinicalData) {
      this.props.clinicalSigns = clinicalData;
      this.validate();
   }
   addBiologicalTestResult(...biologicalTestResults: BiologicalTestResult[]) {
      for (const biologicalTestResult of biologicalTestResults) {
         const biologicalTestResultIndex = this.props.biologicalTestResults.findIndex(
            (bioTestRes) => bioTestRes.unpack().code === biologicalTestResult.unpack().code,
         );
         if (biologicalTestResultIndex != -1) {
            this.props.biologicalTestResults[biologicalTestResultIndex] = biologicalTestResult;
         } else this.props.biologicalTestResults.push(biologicalTestResult);
      }
      this.validate();
   }
   removeBiologicalTestResult(...biologicalTestResults: BiologicalTestResult[]) {
      for (const biologicalTestResult of biologicalTestResults) {
         const biologicalTestResultIndex = this.props.biologicalTestResults.findIndex(
            (bioTestRes) => bioTestRes.unpack().code === biologicalTestResult.unpack().code,
         );
         if (biologicalTestResultIndex != -1) {
            this.props.biologicalTestResults.splice(biologicalTestResultIndex, 1);
         }
      }
      this.validate();
   }
   public validate(): void {
      this._isValid = false;
      if (this.props.birthday.getAge() > MAX_AGE_IN_PEDIATRIC) {
         throw new ArgumentOutOfRangeException(`The age in pediatric must be less than ${MAX_AGE_IN_PEDIATRIC}`);
      }
      if (this.props.gender.isOther()) {
         throw new ArgumentInvalidException(`The sex in pediatric can't not be ${this.props.gender.sex}`);
      }
      this._isValid = true;
   }
   static create(createProps: CreatePatientDiagnosticData, id: AggregateID): Result<PatientDiagnosticData> {
      try {
         const genderRes = Gender.create(createProps.sex);
         const birthDayRes = Birthday.create(createProps.birthday);
         const anthropMeasuresRes = AnthropometricData.create(createProps.anthropometricData);
         const clinicalSignsRes = ClinicalData.create(createProps.clinicalSigns);
         const biologicalTestResultsRes = createProps.biologicalTestResults.map((val) => BiologicalTestResult.create(val));
         const combinedRes = Result.combine([genderRes, birthDayRes, anthropMeasuresRes, clinicalSignsRes, ...biologicalTestResultsRes]);
         if (combinedRes.isFailure) return Result.fail(String(combinedRes.err));
         return Result.ok(
            new PatientDiagnosticData({
               id,
               props: {
                  gender: genderRes.val,
                  birthday: birthDayRes.val,
                  anthropMeasures: anthropMeasuresRes.val,
                  clinicalSigns: clinicalSignsRes.val,
                  biologicalTestResults: biologicalTestResultsRes.map((valRes) => valRes.val),
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
