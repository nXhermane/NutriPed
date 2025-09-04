
import { Result } from '../../../../core/shared/core/Result';

describe('Result', () => {
  describe('ok', () => {
    it('should create a success result', () => {
      const result = Result.ok<string>('test');
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
      expect(result.val).toBe('test');
    });

    it('should create a success result without value', () => {
      const result = Result.ok();
      expect(result.isSuccess).toBe(true);
      expect(result.isFailure).toBe(false);
    });

    it('should throw an error when trying to create a success result with an error', () => {
      expect(() => {
        new Result<string>(true, 'error', 'value');
      }).toThrow('InvalidOperation: A result cannot be successful and contain an error');
    });
  });

  describe('fail', () => {
    it('should create a failure result', () => {
      const result = Result.fail<string>('error message');
      expect(result.isSuccess).toBe(false);
      expect(result.isFailure).toBe(true);
      expect(result.err).toBe('error message');
    });

    it('should throw an error when trying to access the value of a failure result', () => {
      const result = Result.fail<string>('error message');
      expect(() => {
        result.val;
      }).toThrow("Can't get the value of an error result. Use 'errorValue' instead.");
    });

    it('should throw an error when trying to create a failure result without an error', () => {
      expect(() => {
        new Result<string>(false);
      }).toThrow('InvalidOperation: A failing result needs to contain an error message');
    });
  });

  describe('combine', () => {
    it('should return the first failure result when combining results with at least one failure', () => {
      const result1 = Result.ok<string>('test1');
      const result2 = Result.fail<string>('error2');
      const result3 = Result.ok<string>('test3');

      const combinedResult = Result.combine([result1, result2, result3]);
      expect(combinedResult.isFailure).toBe(true);
      expect(combinedResult.err).toBe('error2');
    });

    it('should return a success result when combining only success results', () => {
      const result1 = Result.ok<string>('test1');
      const result2 = Result.ok<number>(2);
      const result3 = Result.ok<boolean>(true);

      const combinedResult = Result.combine([result1, result2, result3]);
      expect(combinedResult.isSuccess).toBe(true);
    });
  });

  describe('encapsulate', () => {
    it('should return a success result when the function executes without error', () => {
      const func = () => 'test';
      const result = Result.encapsulate(func);
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe('test');
    });

    it('should return a failure result when the function throws an error', () => {
      const func = () => {
        throw new Error('test error');
      };
      const result = Result.encapsulate(func);
      expect(result.isFailure).toBe(true);
    });
  });

  describe('encapsulateAsync', () => {
    it('should return a success result when the async function resolves', async () => {
      const func = async () => 'test';
      const result = await Result.encapsulateAsync(func);
      expect(result.isSuccess).toBe(true);
      expect(result.val).toBe('test');
    });

    it('should return a failure result when the async function rejects', async () => {
      const func = async () => {
        throw new Error('test error');
      };
      const result = await Result.encapsulateAsync(func);
      expect(result.isFailure).toBe(true);
    });
  });
});

