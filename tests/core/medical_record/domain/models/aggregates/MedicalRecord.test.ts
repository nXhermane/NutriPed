import { MedicalRecord } from '@medical_record/domain/models/aggregates/MedicalRecord';
import {
  AggregateID,
  SystemCode,
  DomainDateTime,
  UnitCode,
} from '@shared';
import {
  AnthropometricRecord,
  AppetiteTestRecord,
  BiologicalValueRecord,
  ClinicalSingDataRecord,
  ComplicationDataRecord,
  DataFieldResponse,
  OrientationRecord,
} from '@medical_record/domain/models/entities';
import { mock, MockProxy } from 'jest-mock-extended';
import { APPETITE_TEST_PRODUCT_TYPE, APPETITE_TEST_SACHET_FRACTION_PARTITION, CARE_PHASE_CODES } from '@/core/constants';

describe('MedicalRecord', () => {
  let mockPatientId: MockProxy<AggregateID>;
  let mockRecordId: MockProxy<AggregateID>;
  let medicalRecord: MedicalRecord;

  beforeEach(() => {
    mockPatientId = mock<AggregateID>();
    mockRecordId = mock<AggregateID>();
    const medicalRecordResult = MedicalRecord.create(
      { patientId: mockPatientId },
      mockRecordId,
    );
    medicalRecord = medicalRecordResult.val;
  });

  it('should create a new medical record', () => {
    expect(medicalRecord).toBeInstanceOf(MedicalRecord);
    expect(medicalRecord.getPatientId()).toBe(mockPatientId);
    expect(medicalRecord.getAnthropometricData()).toEqual([]);
    expect(medicalRecord.getClinicalData()).toEqual([]);
    expect(medicalRecord.getBiologicalData()).toEqual([]);
  });

  describe('addAnthropometricData', () => {
    it('should add a new anthropometric record', () => {
      const codeResult = SystemCode.create('weight');
      const unitResult = UnitCode.create('kg');
      if (codeResult.isFailure) throw new Error(codeResult.err);
      if (unitResult.isFailure) throw new Error(unitResult.err);

      const anthropometricRecordResult = AnthropometricRecord.create({
        code: 'weight',
        value: 70,
        unit: 'kg',
        context: 'admission'
      }, mockRecordId);

      if (anthropometricRecordResult.isFailure) throw new Error(anthropometricRecordResult.err);

      medicalRecord.addAnthropometricData(anthropometricRecordResult.val);
      expect(medicalRecord.getAnthropometricData().length).toBe(1);
      expect(medicalRecord.getAnthropometricData()[0].code.unpack()).toBe('weight');
    });
  });

  describe('addClinicalSignData', () => {
    it('should add a new clinical sign data record', () => {
      const codeResult = SystemCode.create('edema');
      if (codeResult.isFailure) throw new Error(codeResult.err);

      const clinicalSignRecordResult = ClinicalSingDataRecord.create({
        code: 'clinical_edema',
        isPresent: true,
        data: {},
      }, mockRecordId);

      if (clinicalSignRecordResult.isFailure) throw new Error(clinicalSignRecordResult.err);

      medicalRecord.addClinicalSignData(clinicalSignRecordResult.val);
      expect(medicalRecord.getClinicalData().length).toBe(1);
      expect(medicalRecord.getClinicalData()[0].code.unpack()).toBe('clinical_edema');
    });
  });

  describe('addBiologicalValue', () => {
    it('should add a new biological value record', () => {
      const codeResult = SystemCode.create('hemoglobin');
      const unitResult = UnitCode.create('g/dL');
      if (codeResult.isFailure) throw new Error(codeResult.err);
      if (unitResult.isFailure) throw new Error(unitResult.err);

      const biologicalValueRecordResult = BiologicalValueRecord.create({
        code: 'hemoglobin',
        value: 12,
        unit: 'g/dL',
      }, mockRecordId);

      if (biologicalValueRecordResult.isFailure) throw new Error(biologicalValueRecordResult.err);

      medicalRecord.addBiologicalValue(biologicalValueRecordResult.val);
      expect(medicalRecord.getBiologicalData().length).toBe(1);
      expect(medicalRecord.getBiologicalData()[0].code.unpack()).toBe('hemoglobin');
    });
  });

  describe('addComplicationData', () => {
    it('should add a new complication data record', () => {
      const complicationRecordResult = ComplicationDataRecord.create({
        code: 'complications_number',
        isPresent: true,
      }, mockRecordId);

      if (complicationRecordResult.isFailure) throw new Error(complicationRecordResult.err);

      medicalRecord.addComplicationData(complicationRecordResult.val);
      expect(medicalRecord.getComplicationData().length).toBe(1);
      expect(medicalRecord.getComplicationData()[0].code.unpack()).toBe('complications_number');
    });
  });

  describe('addAppetiteTestData', () => {
    it('should add a new appetite test data record', () => {
      const appetiteTestRecordResult = AppetiteTestRecord.create({
        amount: {
          fraction: APPETITE_TEST_SACHET_FRACTION_PARTITION.ONE_HALF,
        },
        productType: APPETITE_TEST_PRODUCT_TYPE.IN_SACHET,
        fieldResponses: {},
      }, mockRecordId);

      if (appetiteTestRecordResult.isFailure) throw new Error(appetiteTestRecordResult.err);

      medicalRecord.addAppetiteTestRecord(appetiteTestRecordResult.val);
      expect(medicalRecord.getAppetiteTest().length).toBe(1);
      expect(medicalRecord.getAppetiteTest()[0].productType).toBe(APPETITE_TEST_PRODUCT_TYPE.IN_SACHET);
    });
  });

  describe('addOrientationData', () => {
    it('should add a new orientation data record', () => {
      const orientationRecordResult = OrientationRecord.create({
        code: 'ORIENTATION_HOME',
        treatmentPhase: null,
      }, mockRecordId);

      if (orientationRecordResult.isFailure) throw new Error(orientationRecordResult.err);

      medicalRecord.addOrientationRecord(orientationRecordResult.val);
      expect(medicalRecord.getOrientationRecord().length).toBe(1);
      expect(medicalRecord.getOrientationRecord()[0].code.unpack()).toBe('ORIENTATION_HOME');
    });
  });
});
