// Jest setup file
import "@testing-library/jest-native";

// Extend Jest matchers
expect.extend({
  toBeSuccessResult(received) {
    const pass = received.isSuccess === true;
    if (pass) {
      return {
        message: () => `expected ${received} not to be a success Result`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be a success Result, but it was a failure with error: ${received.err}`,
        pass: false,
      };
    }
  },
  toBeFailureResult(received) {
    const pass = received.isFailure === true;
    if (pass) {
      return {
        message: () => `expected ${received} not to be a failure Result`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be a failure Result, but it was a success with value: ${received.val}`,
        pass: false,
      };
    }
  },
  toBeRight(received) {
    const pass = received.isRight && received.isRight();
    if (pass) {
      return {
        message: () => `expected ${received} not to be a Right Either`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be a Right Either, but it was a Left with value: ${received.value}`,
        pass: false,
      };
    }
  },
  toBeLeft(received) {
    const pass = received.isLeft && received.isLeft();
    if (pass) {
      return {
        message: () => `expected ${received} not to be a Left Either`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${received} to be a Left Either, but it was a Right with value: ${received.value}`,
        pass: false,
      };
    }
  },
});

// Suppress console.log during tests
global.console = {
  ...console,
  // Uncomment to suppress logs during tests
  // log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  // Keep error and warn for debugging
  // error: jest.fn(),
  // warn: jest.fn(),
};

// Mock timers
jest.useFakeTimers();
