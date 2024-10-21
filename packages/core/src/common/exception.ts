export class Exception extends Error {
  constructor(
    public code: ExceptionCode,
    public message: string,
  ) {
    super(message);
  }
}

export enum ExceptionCode {
  INTERNAL_SERVER_EXCEPTION = "exception.internal_server_exception",
}

export class InternalServerException extends Exception {
  constructor() {
    super(ExceptionCode.INTERNAL_SERVER_EXCEPTION, "Internal Server Error");
  }
}
