import type { RequestArguments } from "@open-rpc/client-js/build/ClientInterface.js";

/**
 * The transport interface.
 */
abstract class ITransport {
  /**
   * Sends a request.
   * @param requestObject - The request object. It contains the method and parameters.
   * @returns The response.
   */
  abstract request<T>(requestObject: RequestArguments): Promise<T>;

  /**
   * Connects to the network.
   */
  abstract connect(): void;

  /**
   * Closes the connection to the network.
   */
  abstract closeConnection(): void;

  /**
   * Polls until a condition is met.
   * @param requestObject - The request object. It contains the method and parameters.
   * @param condition - The condition to check.
   * @param interval - The interval to poll.
   * @param pollingTimeout - The polling timeout. By default it is equal to the timeout.
   */
  abstract startPollingUntil<T>(
    cb: () => Promise<T>,
    condition: (result: T) => boolean,
    interval?: number,
    pollingTimeout?: number,
  ): Promise<T>;
}

export { ITransport };
