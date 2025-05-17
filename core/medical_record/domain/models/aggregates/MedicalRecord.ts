import { AggregateID, AggregateRoot, EntityPropsBaseType, handleError, Result } from "@shared";
import {
   AnthropometricData,
   BiologicalValue,
   ClinicalSignData,
   ComplicationData,
   DataFieldResponse,
   IAnthropometricData,
   IBiologicalValue,
   IClinicalSignData,
   IComplicationData,
   IDataFieldResponse,
} from "../valueObjects";
import {
   AnthropometricDataAddedEvent,
   BiologicalValueAddedEvent,
   ClinicalSignDataAddedEvent,
   ComplicationDataAddedEvent,
   DataFieldResponseAddedEvent,
} from "../../events";

export interface IMedicalRecord extends EntityPropsBaseType {
   patientId: AggregateID;
   anthropometricData: AnthropometricData[];
   clinicalData: ClinicalSignData[];
   biologicalData: BiologicalValue[];
   complicationData: ComplicationData[];
   dataFieldsResponse: DataFieldResponse[];
}

export class MedicalRecord extends AggregateRoot<IMedicalRecord> {
   getPatientId(): AggregateID {
      return this.props.patientId;
   }
   getAnthropometricData(): IAnthropometricData[] {
      return this.props.anthropometricData.map((valObj) => valObj.unpack());
   }
   getClinicalData(): IClinicalSignData[] {
      return this.props.clinicalData.map((valObj) => valObj.unpack());
   }
   getBiologicalData(): IBiologicalValue[] {
      return this.props.biologicalData.map((valObj) => valObj.unpack());
   }
   getComplicationData(): IComplicationData[] {
      return this.props.complicationData.map((valObj) => valObj.unpack());
   }
   getDataFields(): IDataFieldResponse[] {
      return this.props.dataFieldsResponse.map((valObj) => valObj.unpack());
   }
   addAnthropometricData(anthropometricData: AnthropometricData) {
      this.props.anthropometricData.push(anthropometricData);
      const { code, context, unit, value } = anthropometricData.unpack();
      this.addDomainEvent(
         new AnthropometricDataAddedEvent({
            patientId: this.getPatientId(),
            data: {
               code: code.unpack(),
               context,
               unit: unit.unpack(),
               value,
            },
         }),
      );
   }
   addClinicalSignData(clinicalSignData: ClinicalSignData) {
      this.props.clinicalData.push(clinicalSignData);
      const { code, data } = clinicalSignData.unpack();
      this.addDomainEvent(
         new ClinicalSignDataAddedEvent({
            patientId: this.getPatientId(),
            data: {
               code: code.unpack(),
               data,
            },
         }),
      );
   }
   addBiologicalValue(biologicalValue: BiologicalValue) {
      this.props.biologicalData.push(biologicalValue);
      const { code, unit, value } = biologicalValue.unpack();
      this.addDomainEvent(
         new BiologicalValueAddedEvent({
            patientId: this.getPatientId(),
            data: {
               code: code.unpack(),
               unit: unit.unpack(),
               value,
            },
         }),
      );
   }
   addComplicationData(complicationData: ComplicationData) {
      this.props.complicationData.push(complicationData);
      const { code, isPresent } = complicationData.unpack();
      this.addDomainEvent(
         new ComplicationDataAddedEvent({
            patientId: this.getPatientId(),
            data: {
               code: code.unpack(),
               isPresent,
            },
         }),
      );
   }
   addDataField(dataField: DataFieldResponse) {
      this.props.dataFieldsResponse.push(dataField);
      const { code, type, value, unit } = dataField.unpack();
      this.addDomainEvent(
         new DataFieldResponseAddedEvent({
            patientId: this.getPatientId(),
            data: {
               code: code.unpack(),
               type,
               value,
               unit: unit?.unpack(),
            },
         }),
      );
   }
   changeAnthropometricData(anthropometricData: AnthropometricData[]) {
      this.props.anthropometricData = anthropometricData;
   }
   changeClinicalData(clinicalData: ClinicalSignData[]) {
      this.props.clinicalData = clinicalData;
   }
   changeBiologicalData(biologicalValues: BiologicalValue[]) {
      this.props.biologicalData = biologicalValues;
   }
   changeComplicationData(complicationData: ComplicationData[]) {
      this.props.complicationData = complicationData;
   }
   changeDataFields(dataFields: DataFieldResponse[]) {
      this.props.dataFieldsResponse = dataFields;
   }

   public validate(): void {
      this._isValid = false;
      // BETA: Validation code here if needed
      this._isValid = true;
   }

   static create(createProps: { patientId: AggregateID }, id: AggregateID): Result<MedicalRecord> {
      try {
         return Result.ok(
            new MedicalRecord({
               id: id,
               props: {
                  patientId: createProps.patientId,
                  anthropometricData: [],
                  biologicalData: [],
                  clinicalData: [],
                  complicationData: [],
                  dataFieldsResponse: [],
               },
            }),
         );
      } catch (e: unknown) {
         return handleError(e);
      }
   }
}
