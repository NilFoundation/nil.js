/**
 * The configuration of the HTTP transport.
 */
type IHttpTransportConfig = {
  /**
   * The endpoint of the network. It is a URL of the network node.
   * @example 'http://127.0.0.1:8529'
   */
  endpoint: string;
  /**
   * The polling interval is used to poll the network for new data.
   * @example 1000
   * @default 1000
   */
  pollingInterval?: number;
  /**
   * The timeout is used to set the timeout for the request.
   * If the request is not completed within the timeout, it will be rejected.
   * @example 1000
   * @default 20000
   */
  timeout?: number;
};

export type { IHttpTransportConfig };
