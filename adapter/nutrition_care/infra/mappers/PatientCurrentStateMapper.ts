import { PatientCurrentState } from "@core/nutrition_care";
import { DomainDate, InfrastructureMapper } from "@shared";
import { PatientCurrentStatePersistenceDto } from "../dtos";

export class PatientCurrentStateInfraMapper
  implements
    InfrastructureMapper<PatientCurrentState, PatientCurrentStatePersistenceDto>
{
  toPersistence(
    entity: PatientCurrentState
  ): PatientCurrentStatePersistenceDto {
    const {
      id,
      createdAt,
      updatedAt,
      anthropometricData,
      appetiteTestResult,
      biologicalData,
      clinicalSignData,
      complicationData,
    } = entity.getProps();
    return {
      id: id as string,
      createdAt,
      updatedAt,
      anthropometricData: Object.fromEntries(
        Object.values(anthropometricData).map(anthroValue => [
          anthroValue.code,
          {
            code: anthroValue.code,
            value: anthroValue.value,
            date: anthroValue.date.unpack(),
          },
        ])
      ),
      appetiteTestResult: Object.fromEntries(
        Object.values(appetiteTestResult).map(appetiteValue => [
          appetiteValue.code,
          {
            code: appetiteValue.code,
            value: appetiteValue.value,
            date: appetiteValue.date.unpack(),
          },
        ])
      ),
      biologicalData: Object.fromEntries(
        Object.values(biologicalData).map(biologicalValue => [
          biologicalValue.code,
          {
            code: biologicalValue.code,
            value: biologicalValue.value,
            date: biologicalValue.date.unpack(),
          },
        ])
      ),
      clinicalSignData: Object.fromEntries(
        Object.values(clinicalSignData).map(clinicalValue => [
          clinicalValue.code,
          {
            code: clinicalValue.code,
            value: clinicalValue.value,
            date: clinicalValue.date.unpack(),
          },
        ])
      ),
      complicationData: Object.fromEntries(
        Object.values(complicationData).map(complicationValue => [
          complicationValue.code,
          {
            code: complicationValue.code,
            value: complicationValue.value,
            date: complicationValue.date.unpack(),
          },
        ])
      ),
      otherData: entity.getOtherData(),
    };
  }
  toDomain(record: PatientCurrentStatePersistenceDto): PatientCurrentState {
    const anthropometricData = Object.fromEntries(
      Object.values(record.anthropometricData).map(_value => [
        _value.code,
        {
          code: _value.code,
          value: _value.value,
          date: new DomainDate(_value.date),
        },
      ])
    );
    const clinicalSignData = Object.fromEntries(
      Object.values(record.clinicalSignData).map(_value => [
        _value.code,
        {
          code: _value.code,
          value: _value.value,
          date: new DomainDate(_value.date),
        },
      ])
    );
    const appetiteTestResult = Object.fromEntries(
      Object.values(record.appetiteTestResult).map(_value => [
        _value.code,
        {
          code: _value.code,
          value: _value.value,
          date: new DomainDate(_value.date),
        },
      ])
    );
    const biologicalData = Object.fromEntries(
      Object.values(record.biologicalData).map(_value => [
        _value.code,
        {
          code: _value.code,
          value: _value.value,
          date: new DomainDate(_value.date),
        },
      ])
    );
    const complicationData = Object.fromEntries(
      Object.values(record.complicationData).map(_value => [
        _value.code,
        {
          code: _value.code,
          value: _value.value,
          date: new DomainDate(_value.date),
        },
      ])
    );
    const patientCurrentState = new PatientCurrentState({
      id: record.id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props: {
        anthropometricData: anthropometricData as never,
        appetiteTestResult,
        biologicalData: biologicalData as never,
        clinicalSignData: clinicalSignData as never,
        complicationData,
        otherData: record.otherData,
      },
    });
    return patientCurrentState;
  }
}
