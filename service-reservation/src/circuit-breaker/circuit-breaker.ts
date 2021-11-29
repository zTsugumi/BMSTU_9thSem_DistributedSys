import { SetMetadata } from '@nestjs/common';
import {
  commandFactory,
  circuitFactory,
  metricsFactory,
  Command,
  CircuitBreaker,
  CommandMetrics,
} from 'hystrixjs';
import { from, mergeMap, map, filter, interval } from 'rxjs';
import { CircuitBreakerConfig } from './interfaces/circuitBreakerConfig.interface';
import { CustomLogger } from './interfaces/customLogger.interface';
import { HystrixInfo } from './interfaces/hystrixInfo.interface';
import { CIRCUIT_BREAKER_CONFIG, CircuitBreakerConfigDefaults } from './common/constant';
import * as _ from 'lodash/fp';

export const CircuitBreakerProtected = (config?: CircuitBreakerConfig) =>
  SetMetadata(CIRCUIT_BREAKER_CONFIG, _.defaults(CircuitBreakerConfigDefaults, config));

export function addCircuitBreakerTo<T>(service: T, group: any): T {
  const commandCache = new Map<string, Command>();

  return new Proxy(service as any, {
    get: function (target: any, prop: any) {
      const propertyValue = Reflect.get(target, prop);

      if (typeof propertyValue !== 'function') {
        return propertyValue;
      }

      if (commandCache.has(prop)) {
        return commandCache.get(prop);
      }

      const circuitBreakerConfig = Reflect.getMetadata(
        CIRCUIT_BREAKER_CONFIG,
        propertyValue,
      ) as CircuitBreakerConfig;
      if (!circuitBreakerConfig) {
        return propertyValue;
      }

      const command = toCommand(
        `${group.name}.${prop}`,
        group.name,
        propertyValue.bind(target),
        circuitBreakerConfig,
      );

      commandCache.set(prop, command.execute.bind(command));

      return commandCache.get(prop);
    },
  });
}

export function makeCircuitBreakerStateObserver(logger: CustomLogger) {
  return function startObservingCircuitBreakerState(
    pollIntervalInMillis = 5000,
    spawnPollEvent = interval,
    metricsSource = metricsFactory,
    circuitSource = circuitFactory,
  ) {
    spawnPollEvent(pollIntervalInMillis)
      .pipe(
        mergeMap(() => from(metricsSource.getAllMetrics())),
        map((metrics: CommandMetrics) => {
          (metrics as any).update();
          const commandKey = (metrics as any).commandKey;
          const circuitBreaker = (circuitSource as any).getOrCreate({
            commandKey,
          }) as CircuitBreaker;

          return { metrics, commandKey, circuitBreaker };
        }),
        filter(({ circuitBreaker }: HystrixInfo) => circuitBreaker.isOpen()),
      )
      .subscribe(alertAboutOpenCircuitBreaker(logger));
  };
}

export function resetAllCircuitBreakerCaches() {
  commandFactory.resetCache();
  circuitFactory.resetCache();
  metricsFactory.resetCache();
}

function toCommand(
  name: string,
  group: string,
  func: (...args: any[]) => Promise<any>,
  config: CircuitBreakerConfig,
): Command {
  return (
    commandFactory
      .getOrCreate(name, group)
      .run(func)
      // how long the cb should stay opened, before allowing a single request to test the health of the service
      .circuitBreakerSleepWindowInMilliseconds(config.circuitBreakerSleepWindowInMilliseconds)
      // error percentage threshold to trip the circuit
      .circuitBreakerErrorThresholdPercentage(config.circuitBreakerErrorThresholdPercentage)
      // minimum number of requests in a rolling window that needs to be exceeded, before the cb will bother at all to calculate the health
      .circuitBreakerRequestVolumeThreshold(config.circuitBreakerRequestVolumeThreshold)
      // timeout for request
      .timeout(config.timeout)
      // length of the window to keep track of execution counts metrics (success, failure)
      .statisticalWindowLength(config.statisticalWindowLength)
      // number of buckets within the statistical window
      .statisticalWindowNumberOfBuckets(config.statisticalWindowNumberOfBuckets)
      .fallbackTo(config.fallbackTo)
      .errorHandler(config.shouldErrorBeConsidered)
      .build()
  );
}

function alertAboutOpenCircuitBreaker(logger: CustomLogger): any {
  return ({ metrics, commandKey }: HystrixInfo) => {
    const healthCounts = metrics.getHealthCounts();
    if (healthCounts.errorCount > 0) {
      const group = 'Back off';
      const subject = `"${group}" is active for ${commandKey}`;
      const message = `${subject}. Health stats: ${JSON.stringify(healthCounts)}`;

      logger.error(message);
    }
  };
}
