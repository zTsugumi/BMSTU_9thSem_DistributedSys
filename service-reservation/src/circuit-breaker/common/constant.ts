import { CircuitBreakerConfig } from '../interfaces/circuitBreakerConfig.interface';

export const CIRCUIT_BREAKER_CONFIG = 'CircuitBreakerConfig';

export const CircuitBreakerConfigDefaults: CircuitBreakerConfig = {
  circuitBreakerSleepWindowInMilliseconds: 3000,
  circuitBreakerErrorThresholdPercentage: 50,
  circuitBreakerRequestVolumeThreshold: 10,
  timeout: 10000,
  statisticalWindowLength: 10000,
  statisticalWindowNumberOfBuckets: 10,
  fallbackTo: undefined,
  shouldErrorBeConsidered: undefined,
};
