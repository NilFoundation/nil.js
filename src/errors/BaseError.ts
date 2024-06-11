/**
 * Interface for the parameters of the BaseError constructor.
 */
type IBaseErrorParameters = {
  /**
   * Indicates if this error is operational.
   * This is useful to differentiate operational errors from programming errors.
   * It is recommended to always set this property to true when creating a custom error class.
   * @default true
   */
  isOperational?: boolean;
  /**
   * The error that caused this error.
   */
  cause?: Error | BaseError;
  /**
   * The path to the documentation of this error.
   */
  docsPath?: string;
};

/**
 * Base class for custom errors.
 */
class BaseError extends Error {
  public isOperational: boolean;
  public cause?: Error | BaseError;
  public docsPath?: string;

  constructor(
    message?: string,
    { isOperational = true, cause, docsPath }: IBaseErrorParameters = {},
  ) {
    super();
    this.name = this.constructor.name;
    this.isOperational = isOperational;
    this.cause = cause;
    this.docsPath = docsPath;

    this.message = `${message ?? "An error occured"}
      Name: ${this.name}`;

    if (docsPath) {
      this.message = `${this.message}
      Docs: see \${this.docsPath}`;
    }

    // This line is needed to make the instanceof operator work correctly with custom errors in TypeScript
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

export { BaseError, type IBaseErrorParameters };
