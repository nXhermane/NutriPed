import { UnitMapper } from '../../../../../core/units/application/mappers/UnitMapper';
import { Unit } from '../../../../../core/units/domain/models';
import { UnitType } from '../../../../../core/units/domain/models/constants';

describe('UnitMapper', () => {
  const mapper = new UnitMapper();

  it('should correctly map a Unit entity to a UnitDto', () => {
    // Arrange
    const unitResult = Unit.create(
      {
        name: 'Kilogram',
        code: 'kg',
        conversionFactor: 1000,
        baseUnitCode: 'g',
        type: UnitType.MASS,
      },
      'test-id'
    );

    if (unitResult.isFailure) {
      throw new Error('Failed to create mock unit for testing');
    }

    const unitEntity = unitResult.val;

    // Act
    const unitDto = mapper.toResponse(unitEntity);

    // Assert
    expect(unitDto.id).toBe('test-id');
    expect(unitDto.name).toBe('Kilogram');
    expect(unitDto.code).toBe('kg');
    expect(unitDto.baseUnitCode).toBe('g');
    expect(unitDto.conversionFactor).toBe(1000);
    expect(unitDto.type).toBe(UnitType.MASS);
    expect(unitDto.createdAt).toBe(unitEntity.createdAt);
    expect(unitDto.updatedAt).toBe(unitEntity.updatedAt);
  });
});
