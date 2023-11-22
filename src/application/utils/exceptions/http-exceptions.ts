import HttpStatusCode from "./statusCode";

class HttpException extends Error {
  status: HttpStatusCode;
  message: string;

  constructor(status: HttpStatusCode, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

export default HttpException;
