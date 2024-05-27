/**
 * Polls a callback function until a condition is met.
 * @param cb - Callback function to be executed
 * @param condition - Condition to be met
 * @param interval - Interval in milliseconds
 * @returns Result of the callback function
 */
const startPollingUntilCondition = async <Result>(
  cb: () => Promise<Result>,
  condition: (result: Result) => boolean,
  interval: number,
) => {
  let result: Result | undefined;

  while (true) {
    result = await cb();

    if (condition(result)) {
      return result;
    }

    await new Promise((resolve) => setTimeout(resolve, interval));
  }
};

export { startPollingUntilCondition };
