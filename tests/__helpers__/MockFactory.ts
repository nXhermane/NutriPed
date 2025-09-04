import { Result } from '../../core/shared/core/Result';

/**
 * Factory pour créer des mocks pour les tests unitaires
 */

export class MockFactory {
  /**
   * Crée un mock pour un repository
   * @param methods Les méthodes à mocker
   * @returns Le mock du repository
   */
  static createRepositoryMock<T>(methods: Partial<T> = {}): jest.Mocked<T> {
    const mock = methods as jest.Mocked<T>;
    return mock;
  }

  /**
   * Crée un mock pour un service
   * @param methods Les méthodes à mocker
   * @returns Le mock du service
   */
  static createServiceMock<T>(methods: Partial<T> = {}): jest.Mocked<T> {
    const mock = methods as jest.Mocked<T>;
    return mock;
  }

  /**
   * Crée un mock pour un cas d'utilisation
   * @param executeResult Le résultat de l'exécution du cas d'utilisation
   * @returns Le mock du cas d'utilisation
   */
  static createUseCaseMock<Request, Response>(
    executeResult: Response
  ): jest.Mocked<{
    execute: (request: Request) => Promise<Response>;
  }> {
    return {
      execute: jest.fn().mockResolvedValue(executeResult),
    } as any;
  }

  /**
   * Crée un mock pour un Result.ok
   * @param value La valeur du Result
   * @returns Le mock du Result
   */
  static createSuccessResult<T>(value: T): Result<T> {
    return Result.ok<T>(value);
  }

  /**
   * Crée un mock pour un Result.fail
   * @param error L'erreur du Result
   * @returns Le mock du Result
   */
  static createFailureResult<T>(error: string): Result<T> {
    return Result.fail<T>(error);
  }
}

