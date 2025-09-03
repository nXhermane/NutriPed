import { DeleteUnitUseCase } from '../../../../../../../core/units/application/useCases/Unit/Delete/UseCase';
import { Unit, UnitRepository } from '../../../../../../../core/units/domain';

// Mock Unit entity
const mockUnit: jest.Mocked<Unit> = {
  id: 'test-id',
  delete: jest.fn(),
} as any;

// Mock UnitRepository
const mockUnitRepository: jest.Mocked<UnitRepository> = {
  getById: jest.fn().mockResolvedValue(mockUnit),
  remove: jest.fn(),
  exist: jest.fn(),
  save: jest.fn(),
  getByCode: jest.fn(),
  getAll: jest.fn(),
  delete: jest.fn(),
};

describe('DeleteUnitUseCase', () => {
  let useCase: DeleteUnitUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteUnitUseCase(mockUnitRepository);
  });

  it('should delete a unit successfully', async () => {
    // Act
    const result = await useCase.execute({ id: 'test-id' });

    // Assert
    expect(result.isRight()).toBe(true);
    expect(mockUnitRepository.getById).toHaveBeenCalledWith('test-id');
    expect(mockUnit.delete).toHaveBeenCalledTimes(1);
    expect(mockUnitRepository.remove).toHaveBeenCalledWith(mockUnit);
  });

  it('should return a failure when the unit is not found', async () => {
    // Arrange
    mockUnitRepository.getById.mockRejectedValue(new Error('Not Found'));

    // Act
    const result = await useCase.execute({ id: 'non-existent-id' });

    // Assert
    expect(result.isLeft()).toBe(true);
    expect(mockUnitRepository.getById).toHaveBeenCalledWith('non-existent-id');
    expect(mockUnitRepository.remove).not.toHaveBeenCalled();
  });
});
