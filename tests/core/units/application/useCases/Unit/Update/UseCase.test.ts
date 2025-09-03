import { UpdateUnitUseCase } from '../../../../../../../core/units/application/useCases/Unit/Update/UseCase';
import { Unit, UnitRepository, UnitType } from '../../../../../../../core/units/domain';

// Mock Unit entity
const mockUnit: jest.Mocked<Unit> = {
  id: 'test-id',
  changeName: jest.fn(),
  changeBaseUnitAndFactor: jest.fn(),
  changeType: jest.fn(),
} as any;

// Mock UnitRepository
const mockUnitRepository: jest.Mocked<UnitRepository> = {
  getById: jest.fn().mockResolvedValue(mockUnit),
  save: jest.fn(),
  exist: jest.fn(),
  getByCode: jest.fn(),
  getAll: jest.fn(),
  remove: jest.fn(),
  delete: jest.fn(),
};

describe('UpdateUnitUseCase', () => {
  let useCase: UpdateUnitUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateUnitUseCase(mockUnitRepository);
  });

  it('should update a unit successfully', async () => {
    // Arrange
    const updateData = {
      name: 'New Name',
      type: UnitType.VOLUME,
    };

    // Act
    const result = await useCase.execute({ id: 'test-id', data: updateData });

    // Assert
    expect(result.isRight()).toBe(true);
    expect(mockUnitRepository.getById).toHaveBeenCalledWith('test-id');
    expect(mockUnit.changeName).toHaveBeenCalledWith('New Name');
    expect(mockUnit.changeType).toHaveBeenCalledWith(UnitType.VOLUME);
    expect(mockUnitRepository.save).toHaveBeenCalledWith(mockUnit);
  });

  it('should return a failure when the unit is not found', async () => {
    // Arrange
    mockUnitRepository.getById.mockRejectedValue(new Error('Not Found'));

    // Act
    const result = await useCase.execute({ id: 'non-existent-id', data: {} });

    // Assert
    expect(result.isLeft()).toBe(true);
    expect(mockUnitRepository.getById).toHaveBeenCalledWith('non-existent-id');
    expect(mockUnitRepository.save).not.toHaveBeenCalled();
  });
});
