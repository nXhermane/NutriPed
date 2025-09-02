import { Entity, EntityPropsBaseType } from '../../../../../core/shared/domain/common/Entity';
import { DomainDate } from '../../../../../core/shared/domain/shared/valueObjects/Date';

// Création d'une classe d'entité concrète pour les tests
interface TestEntityProps {
  name: string;
  value: number;
}

class TestEntity extends Entity<TestEntityProps> {
  validate(): void {
    if (this.props.name && this.props.value >= 0) {
      this._isValid = true;
    } else {
      this._isValid = false;
    }
  }
}

describe('Entity', () => {
  const validProps = {
    name: 'Test Entity',
    value: 10,
  };

  const validId = '123';
  const validCreatedAt = '2023-01-01';
  const validUpdatedAt = '2023-01-02';

  describe('constructor', () => {
    it('should create a valid entity with all properties', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity).toBeDefined();
      expect(entity.id).toBe(validId);
      expect(entity.createdAt).toBe(validCreatedAt);
      expect(entity.updatedAt).toBe(validUpdatedAt);
      expect(entity.props.name).toBe(validProps.name);
      expect(entity.props.value).toBe(validProps.value);
      expect(entity.isValid()).toBe(true);
    });

    it('should throw an error when props is empty', () => {
      expect(() => {
        new TestEntity({
          id: validId,
          props: {} as TestEntityProps,
          createdAt: validCreatedAt,
          updatedAt: validUpdatedAt,
        });
      }).toThrow('Entity props should not be empty');
    });

    it('should throw an error when props is not an object', () => {
      expect(() => {
        new TestEntity({
          id: validId,
          // @ts-ignore - Testing invalid input
          props: 'not an object',
          createdAt: validCreatedAt,
          updatedAt: validUpdatedAt,
        });
      }).toThrow('Entity props should be an object');
    });

    it('should create dates with current date when not provided', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
      });

      expect(entity).toBeDefined();
      expect(entity.createdAt).toBeDefined();
      expect(entity.updatedAt).toBeDefined();
    });
  });

  describe('getProps', () => {
    it('should return all properties including id, createdAt, and updatedAt', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      const props = entity.getProps();
      expect(props).toEqual({
        id: validId,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
        name: validProps.name,
        value: validProps.value,
      });
    });

    it('should return a frozen object', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      const props = entity.getProps();
      expect(Object.isFrozen(props)).toBe(true);
    });
  });

  describe('isEntity', () => {
    it('should return true for an entity', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(Entity.isEntity(entity)).toBe(true);
    });

    it('should return false for a non-entity', () => {
      expect(Entity.isEntity({})).toBe(false);
      expect(Entity.isEntity(null)).toBe(false);
      expect(Entity.isEntity(undefined)).toBe(false);
      expect(Entity.isEntity('string')).toBe(false);
      expect(Entity.isEntity(123)).toBe(false);
    });
  });

  describe('equals', () => {
    it('should return true for the same entity', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.equals(entity)).toBe(true);
    });

    it('should return true for entities with the same ID', () => {
      const entity1 = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      const entity2 = new TestEntity({
        id: validId,
        props: { name: 'Different Name', value: 20 },
        createdAt: '2023-02-01',
        updatedAt: '2023-02-02',
      });

      expect(entity1.equals(entity2)).toBe(true);
    });

    it('should return false for entities with different IDs', () => {
      const entity1 = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      const entity2 = new TestEntity({
        id: '456',
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity1.equals(entity2)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.equals(null as any)).toBe(false);
      expect(entity.equals(undefined as any)).toBe(false);
    });

    it('should return false for non-entities', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.equals({} as any)).toBe(false);
    });
  });

  describe('validate', () => {
    it('should set _isValid to true for valid props', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.isValid()).toBe(true);
    });

    it('should set _isValid to false for invalid props', () => {
      const entity = new TestEntity({
        id: validId,
        props: { name: '', value: -1 },
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.isValid()).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true for valid entities', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.isValid()).toBe(true);
    });

    it('should return false for invalid entities', () => {
      const entity = new TestEntity({
        id: validId,
        props: { name: '', value: -1 },
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.isValid()).toBe(false);
    });

    it('should return false when validate throws an error', () => {
      class ErrorEntity extends Entity<TestEntityProps> {
        validate(): void {
          throw new Error('Validation error');
        }
      }

      const entity = new ErrorEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.isValid()).toBe(false);
    });
  });

  describe('props proxy', () => {
    it('should update updatedAt when a property is changed', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      const initialUpdatedAt = entity.updatedAt;
      
      // Wait a moment to ensure the updatedAt timestamp changes
      jest.advanceTimersByTime(1000);
      
      entity.props.name = 'Updated Name';
      
      expect(entity.updatedAt).not.toBe(initialUpdatedAt);
    });

    it('should throw an error when trying to set a non-existent property', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(() => {
        // @ts-ignore - Testing invalid property assignment
        entity.props.nonExistentProp = 'value';
      }).toThrow('Property "nonExistentProp" does not exist on entity props.');
    });
  });

  describe('delete', () => {
    it('should set _isDeleted to true', () => {
      const entity = new TestEntity({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(entity.isDeleted).toBe(false);
      entity.delete();
      expect(entity.isDeleted).toBe(true);
    });
  });

  describe('lifecycle methods', () => {
    it('should have created method that can be overridden', () => {
      class EntityWithCreated extends TestEntity {
        created(): void {
          this.props.name = 'Created';
        }
      }

      const entity = new EntityWithCreated({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      entity.created();
      expect(entity.props.name).toBe('Created');
    });

    it('should have updated method that can be overridden', () => {
      class EntityWithUpdated extends TestEntity {
        updated(): void {
          this.props.name = 'Updated';
        }
      }

      const entity = new EntityWithUpdated({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      entity.updated();
      expect(entity.props.name).toBe('Updated');
    });
  });
});

