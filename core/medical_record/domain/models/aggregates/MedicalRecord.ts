import {
  AggregateID,
  AggregateRoot,
  BaseEntityProps,
  DomainDate,
  EntityPropsBaseType,
  handleError,
  Result,
  SystemCode,
  UnitCode,
} from "@shared";
import {
  LastAnthropometricDataChangedEvent,
  LastAppetiteTestRecordChangedEvent,
  LastBiologicalValueChangedEvent,
  LastClinicalSignDataChangedEvent,
  LastComplicationDataChangedEvent,
  LastDataFieldResponseChangedEvent,
} from "../../events";
import {
  AnthropometricRecord,
  AppetiteTestRecord,
  BiologicalValueRecord,
  ClinicalSingDataRecord,
  ComplicationDataRecord,
  DataFieldResponse,
  DataFieldResponseValue,
  IAnthropometricRecord,
  IAppetiteTestRecord,
  IBiologicalValueRecord,
  IClinicalSignDataRecord,
  IComplicationDataRecord,
  IDataFieldResponse,
} from "../entities";
import { APPETITE_TEST_PRODUCT_TYPE } from "@/core/constants";
import { TakenAmountInSachet, TakenAmountOfPot } from "../entities/AppetiteTestRecord";

export interface IMedicalRecord extends EntityPropsBaseType {
  patientId: AggregateID;
  anthropometricData: AnthropometricRecord[];
  clinicalData: ClinicalSingDataRecord[];
  biologicalData: BiologicalValueRecord[];
  complicationData: ComplicationDataRecord[];
  appetiteTests: AppetiteTestRecord[];
  dataFieldsResponse: DataFieldResponse[];
}

export class MedicalRecord extends AggregateRoot<IMedicalRecord> {
  getPatientId(): AggregateID {
    return this.props.patientId;
  }
  getAnthropometricData(): (IAnthropometricRecord & BaseEntityProps)[] {
    return this.props.anthropometricData.map(valObj => valObj.getProps());
  }
  getClinicalData(): (IClinicalSignDataRecord & BaseEntityProps)[] {
    return this.props.clinicalData.map(valObj => valObj.getProps());
  }
  getBiologicalData(): (IBiologicalValueRecord & BaseEntityProps)[] {
    return this.props.biologicalData.map(valObj => valObj.getProps());
  }
  getComplicationData(): (IComplicationDataRecord & BaseEntityProps)[] {
    return this.props.complicationData.map(valObj => valObj.getProps());
  }
  getDataFields(): (IDataFieldResponse & BaseEntityProps)[] {
    return this.props.dataFieldsResponse.map(valObj => valObj.getProps());
  }
  getAppetiteTest(): (IAppetiteTestRecord & BaseEntityProps)[] {
    return this.props.appetiteTests.map(entity => entity.getProps())
  }
  getLastAnthropometricData(date?: DomainDate): (IAnthropometricRecord & BaseEntityProps) {
    const unpackedEntitites = this.props.anthropometricData.map(entity => entity.getProps())
    const anthropArray = (date ? this.getRecordBeforeDate(unpackedEntitites, date) : unpackedEntitites).sort(
      (a, b) =>
        b.recordedAt.getDate().getTime() -
        a.recordedAt.getDate().getTime()
    );
    return anthropArray[0]
  }
  getLastClinicalData(date?: DomainDate): (IClinicalSignDataRecord & BaseEntityProps) {
    const unpackedEntitites = this.props.clinicalData.map(entity => entity.getProps())
    const array = (date ? this.getRecordBeforeDate(unpackedEntitites, date) : unpackedEntitites).sort(
      (a, b) =>
        b.recordedAt.getDate().getTime() -
        a.recordedAt.getDate().getTime()
    );
    return array[0]
  }
  getLastBiologicalData(date?: DomainDate): (IBiologicalValueRecord & BaseEntityProps) {
    const unpackedEntitites = this.props.biologicalData.map(entity => entity.getProps())
    const array = (date ? this.getRecordBeforeDate(unpackedEntitites, date) : unpackedEntitites).sort(
      (a, b) =>
        b.recordedAt.getDate().getTime() -
        a.recordedAt.getDate().getTime()
    );
    return array[0]
  }
  getLastComplicationData(date?: DomainDate): (IComplicationDataRecord & BaseEntityProps) {
    const unpackedEntitites = this.props.complicationData.map(entity => entity.getProps())
    const array = (date ? this.getRecordBeforeDate(unpackedEntitites, date) : unpackedEntitites).sort(
      (a, b) =>
        b.recordedAt.getDate().getTime() -
        a.recordedAt.getDate().getTime()
    );
    return array[0]
  }
  getLastDataFieldData(date?: DomainDate): (IDataFieldResponse & BaseEntityProps) {
    const unpackedEntitites = this.props.dataFieldsResponse.map(entity => entity.getProps())
    const array = (date ? this.getRecordBeforeDate(unpackedEntitites, date) : unpackedEntitites).sort(
      (a, b) =>
        b.recordAt.getDate().getTime() -
        a.recordAt.getDate().getTime()
    );
    return array[0]
  }
  getLastAppetiteTestData(date?: DomainDate): (IAppetiteTestRecord & BaseEntityProps) {
    const unpackedEntitites = this.props.appetiteTests.map(entity => entity.getProps())
    const array = (date ? this.getRecordBeforeDate(unpackedEntitites, date) : unpackedEntitites).sort(
      (a, b) =>
        b.recordAt.getDate().getTime() -
        a.recordAt.getDate().getTime()
    );
    return array[0]
  }
  addAnthropometricData(anthropometricRecord: AnthropometricRecord) {
    this.props.anthropometricData.push(anthropometricRecord);

    this.addDomainEvent(
      new LastAnthropometricDataChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: anthropometricRecord.getCode(),
          context: anthropometricRecord.getContext(),
          ...anthropometricRecord.getMeasurement(),
        },
      })
    );
  }
  addClinicalSignData(clinicalSignDataRecord: ClinicalSingDataRecord) {
    this.props.clinicalData.push(clinicalSignDataRecord);

    this.addDomainEvent(
      new LastClinicalSignDataChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: clinicalSignDataRecord.getCode(),
          data: clinicalSignDataRecord.getData(),
        },
      })
    );
  }
  addBiologicalValue(biologicalValueRecord: BiologicalValueRecord) {
    this.props.biologicalData.push(biologicalValueRecord);

    this.addDomainEvent(
      new LastBiologicalValueChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: biologicalValueRecord.getCode(),
          ...biologicalValueRecord.getMeasurement(),
        },
      })
    );
  }
  addComplicationData(complicationDataRecord: ComplicationDataRecord) {
    this.props.complicationData.push(complicationDataRecord);

    this.addDomainEvent(
      new LastComplicationDataChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: complicationDataRecord.getCode(),
          isPresent: complicationDataRecord.getIsPresent(),
        },
      })
    );
  }
  addDataField(dataField: DataFieldResponse) {
    this.props.dataFieldsResponse.push(dataField);
    this.addDomainEvent(
      new LastDataFieldResponseChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: dataField.getCode(),
          data: dataField.getData(),
        },
      })
    );
  }
  addAppetiteTestRecord(appetiteTest: AppetiteTestRecord) {
    this.props.appetiteTests.push(appetiteTest)
    this.addDomainEvent(
      new LastAppetiteTestRecordChangedEvent({
        patientId: this.getPatientId(),
        data: {
          amount: appetiteTest.getAmount(),
          productType: appetiteTest.getProductType(),
          fieldResponse: appetiteTest.getFields()
        }
      })
    )
  }
  changeAnthropometricRecord(
    id: AggregateID,
    measurement: { unit: UnitCode; value: number }
  ) {
    const findedIndex = this.props.anthropometricData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      this.props.anthropometricData[findedIndex].changeMeasurement(measurement);
      this.publishAnthropometricDataChange(
        this.props.anthropometricData[findedIndex].getProps().code
      );
    }
  }
  changeClinicalDataRecord(
    id: AggregateID,
    data: Partial<{ clinicalSignData: object; isPresent: boolean }>
  ) {
    const findedIndex = this.props.clinicalData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      if (data.clinicalSignData)
        this.props.clinicalData[findedIndex].changeData(data.clinicalSignData);
      if (data.isPresent != undefined)
        this.props.clinicalData[findedIndex].changeIsPresent(data.isPresent);
      this.publishClinicalDataChange(
        this.props.clinicalData[findedIndex].getProps().code
      );
    }
  }

  changeBiologicalDataRecord(
    id: AggregateID,
    measurement: { unit: UnitCode; value: number }
  ) {
    const findedIndex = this.props.biologicalData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      this.props.biologicalData[findedIndex].changeMeasurement(measurement);
      this.publishBiologicalDataChange(
        this.props.biologicalData[findedIndex].getProps().code
      );
    }
  }
  changeComplicationDataRecord(
    id: AggregateID,
    data: Partial<{ isPresent: boolean }>
  ) {
    const findedIndex = this.props.complicationData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      if (data.isPresent != undefined)
        this.props.complicationData[findedIndex].changeIsPresent(
          data.isPresent
        );

      this.publishComplicationDataChange(
        this.props.complicationData[findedIndex].getProps().code
      );
    }
  }
  changeDataFields(id: AggregateID, data: DataFieldResponseValue) {
    const findedIndex = this.props.dataFieldsResponse.findIndex(record => record.id == id)
    if (findedIndex != -1) {
      this.props.dataFieldsResponse[findedIndex].changeData(data)
      this.publishDataFieldResponseChange(this.props.dataFieldsResponse[findedIndex].getProps().code)
    }

  }
  changeAppetiteTest(id: AggregateID, data: {
    amount: TakenAmountInSachet | TakenAmountOfPot
    productType: APPETITE_TEST_PRODUCT_TYPE
  }) {
    const findedIndex = this.props.appetiteTests.findIndex(record => record.id == id)
    if (findedIndex != -1) {
      this.props.appetiteTests[findedIndex].changeData(data)
      this.publishAppetiteTestRecordChange()
    }

  }
  deleteAnthropometricRecord(id: AggregateID) {
    const findedIndex = this.props.anthropometricData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      const deletedData = this.props.anthropometricData.splice(findedIndex, 1);
      this.publishAnthropometricDataChange(deletedData[0].getProps().code);
    }
  }
  deleteClinicalSignRecord(id: AggregateID) {
    const findedIndex = this.props.clinicalData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      const deletedData = this.props.clinicalData.splice(findedIndex, 1);
      this.publishClinicalDataChange(deletedData[0].getProps().code);
    }
  }
  deleteBiologicalRecord(id: AggregateID) {
    const findedIndex = this.props.biologicalData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      const deletedData = this.props.biologicalData.splice(findedIndex, 1);
      this.publishBiologicalDataChange(deletedData[0].getProps().code);
    }
  }
  deleteComplicationRecord(id: AggregateID) {
    const findedIndex = this.props.complicationData.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      const deletedData = this.props.complicationData.splice(findedIndex, 1);
      this.publishComplicationDataChange(deletedData[0].getProps().code);
    }
  }
  deleteDataFieldResponse(id: AggregateID) {
    const findedIndex = this.props.dataFieldsResponse.findIndex(
      record => record.id == id
    );
    if (findedIndex != -1) {
      const deletedData = this.props.dataFieldsResponse.splice(findedIndex, 1);
      this.publishDataFieldResponseChange(deletedData[0].getProps().code);
    }
  }
  deleteAppetiteTestRecord(id: AggregateID) {
    const findedIndex = this.props.appetiteTests.findIndex(
      test => test.id == id
    );
    if (findedIndex != -1) {
      const deletedData = this.props.appetiteTests.splice(findedIndex, 1);
      this.publishAppetiteTestRecordChange()
    }
  }
  private publishAnthropometricDataChange(code: SystemCode) {
    const filteredAnthropometricData = this.props.anthropometricData.filter(
      anthrop => anthrop.getCode() == code.unpack()
    );
    if (filteredAnthropometricData.length == 0) return;
    const sortedAnthropometricData = filteredAnthropometricData.sort(
      (a, b) =>
        new Date(b.getRecordDate()).getTime() -
        new Date(a.getRecordDate()).getTime()
    );
    const lastAnthropometricData = sortedAnthropometricData[0];
    this.addDomainEvent(
      new LastAnthropometricDataChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: lastAnthropometricData.getCode(),
          context: lastAnthropometricData.getContext(),
          ...lastAnthropometricData.getMeasurement(),
        },
      })
    );
  }
  private publishClinicalDataChange(code: SystemCode) {
    const filteredData = this.props.clinicalData.filter(
      clinical => clinical.getCode() == code.unpack()
    );
    if (filteredData.length == 0) return;
    const sortedData = filteredData.sort(
      (a, b) =>
        new Date(b.getRecordAt()).getTime() -
        new Date(a.getRecordAt()).getTime()
    );
    const lastValue = sortedData[0];
    this.addDomainEvent(
      new LastClinicalSignDataChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: lastValue.getCode(),
          data: lastValue.getData(),
        },
      })
    );
  }
  private publishBiologicalDataChange(code: SystemCode) {
    const filteredData = this.props.biologicalData.filter(
      biological => biological.getCode() == code.unpack()
    );
    if (filteredData.length == 0) return;
    const sortedData = filteredData.sort(
      (a, b) =>
        new Date(b.getRecordAt()).getTime() -
        new Date(a.getRecordAt()).getTime()
    );
    const lastValue = sortedData[0];
    this.addDomainEvent(
      new LastBiologicalValueChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: lastValue.getCode(),
          ...lastValue.getMeasurement(),
        },
      })
    );
  }
  private publishComplicationDataChange(code: SystemCode) {
    const filteredData = this.props.complicationData.filter(
      comp => comp.getCode() == code.unpack()
    );
    if (filteredData.length == 0) return;
    const sortedData = filteredData.sort(
      (a, b) =>
        new Date(b.getRecordAt()).getTime() -
        new Date(a.getRecordAt()).getTime()
    );
    const lastValue = sortedData[0];
    this.addDomainEvent(
      new LastComplicationDataChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: lastValue.getCode(),
          isPresent: lastValue.getIsPresent(),
        },
      })
    );
  }
  private publishDataFieldResponseChange(code: SystemCode) {
    const filteredData = this.props.dataFieldsResponse.filter(
      field => field.getCode() == code.unpack()
    );
    if (filteredData.length == 0) return;
    const sortedData = filteredData.sort(
      (a, b) =>
        new Date(b.getRecordAt()).getTime() -
        new Date(a.getRecordAt()).getTime()
    );
    const lastValue = sortedData[0];
    this.addDomainEvent(
      new LastDataFieldResponseChangedEvent({
        patientId: this.getPatientId(),
        data: {
          code: lastValue.getCode(),
          data: lastValue.getData()
        },
      })
    );
  }
  private publishAppetiteTestRecordChange() {
    const sortedData = this.props.appetiteTests.sort(
      (a, b) =>
        new Date(b.getRecordAt()).getTime() -
        new Date(a.getRecordAt()).getTime()
    );
    const lastValue = sortedData[0];
    this.addDomainEvent(
      new LastAppetiteTestRecordChangedEvent({
        patientId: this.getPatientId(),
        data: {
          amount: lastValue.getAmount(),
          productType: lastValue.getProductType()
          , fieldResponse: lastValue.getFields()
        },
      })
    );
  }
  private getRecordBeforeDate<T extends { recordAt: DomainDate } | { recordedAt: DomainDate }>(data: T[], date: DomainDate): T[] {
    return data.filter(value => "recordedAt" in value ? value.recordedAt.isBefore(date) : value.recordAt.isBefore(date))
  }
  public validate(): void {
    this._isValid = false;
    // BETA: Validation code here if needed
    this._isValid = true;
  }

  static create(
    createProps: { patientId: AggregateID },
    id: AggregateID
  ): Result<MedicalRecord> {
    try {
      return Result.ok(
        new MedicalRecord({
          id: id,
          props: {
            patientId: createProps.patientId,
            anthropometricData: [],
            biologicalData: [],
            clinicalData: [],
            appetiteTests: [],
            complicationData: [],
            dataFieldsResponse: [],
          },
        })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
