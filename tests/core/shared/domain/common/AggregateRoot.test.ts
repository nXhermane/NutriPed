import { AggregateRoot } from '../../../../../core/shared/domain/common/AggregateRoot';
import { DomainEvent } from '../../../../../core/shared/domain/events';

// Création d'une classe d'événement de domaine pour les tests
class TestDomainEvent extends DomainEvent<{ value: number }> {
  constructor(aggregateId: string, payload: { value: number }) {
    super('TestDomainEvent', aggregateId, payload);
  }
}

// Création d'une classe d'agrégat concrète pour les tests
interface TestAggregateProps {
  name: string;
  value: number;
}

class TestAggregate extends AggregateRoot<TestAggregateProps> {
  validate(): void {
    if (this.props.name && this.props.value >= 0) {
      this._isValid = true;
    } else {
      this._isValid = false;
    }
  }

  updateValue(newValue: number): void {
    this.props.value = newValue;
    this.addDomainEvent(new TestDomainEvent(this.id.toString(), { value: newValue }));
  }
}

describe('AggregateRoot', () => {
  const validProps = {
    name: 'Test Aggregate',
    value: 10,
  };

  const validId = '123';
  const validCreatedAt = '2023-01-01';
  const validUpdatedAt = '2023-01-02';

  describe('constructor', () => {
    it('should create a valid aggregate with all properties', () => {
      const aggregate = new TestAggregate({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(aggregate).toBeDefined();
      expect(aggregate.id).toBe(validId);
      expect(aggregate.createdAt).toBe(validCreatedAt);
      expect(aggregate.updatedAt).toBe(validUpdatedAt);
      expect(aggregate.props.name).toBe(validProps.name);
      expect(aggregate.props.value).toBe(validProps.value);
      expect(aggregate.isValid()).toBe(true);
    });
  });

  describe('getID', () => {
    it('should return the aggregate ID', () => {
      const aggregate = new TestAggregate({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(aggregate.getID()).toBe(validId);
    });
  });

  describe('getDomainEvents', () => {
    it('should return an empty array when no events have been added', () => {
      const aggregate = new TestAggregate({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      expect(aggregate.getDomainEvents()).toEqual([]);
    });

    it('should return the added domain events', () => {
      const aggregate = new TestAggregate({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      aggregate.updateValue(20);
      aggregate.updateValue(30);

      const events = aggregate.getDomainEvents();
      expect(events.length).toBe(2);
      expect(events[0]).toBeInstanceOf(TestDomainEvent);
      expect(events[0].getAggregateId()).toBe(validId);
      expect(events[0].getPayload()).toEqual({ value: 20 });
      expect(events[1]).toBeInstanceOf(TestDomainEvent);
      expect(events[1].getAggregateId()).toBe(validId);
      expect(events[1].getPayload()).toEqual({ value: 30 });
    });
  });

  describe('clearDomainEvent', () => {
    it('should clear all domain events', () => {
      const aggregate = new TestAggregate({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      aggregate.updateValue(20);
      aggregate.updateValue(30);
      expect(aggregate.getDomainEvents().length).toBe(2);

      aggregate.clearDomainEvent();
      expect(aggregate.getDomainEvents()).toEqual([]);
    });
  });

  describe('addDomainEvent', () => {
    it('should add a domain event and log it', () => {
      // Mock console.info to verify it's called
      const consoleInfoSpy = jest.spyOn(console, 'info');

      const aggregate = new TestAggregate({
        id: validId,
        props: validProps,
        createdAt: validCreatedAt,
        updatedAt: validUpdatedAt,
      });

      aggregate.updateValue(20);

      expect(aggregate.getDomainEvents().length).toBe(1);
      expect(consoleInfoSpy).toHaveBeenCalledWith(
        '[Domain Event Created]:',
        'TestAggregate',
        '==>',
        'TestDomainEvent'
      );

      // Restore the original console.info
      consoleInfoSpy.mockRestore();
    });
  });
});

