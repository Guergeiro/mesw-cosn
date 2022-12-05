export class InternalServerErrorException extends Error {
  public constructor(message = "Internal Server Error") {
    super(message);
    this.name = "InternalServerErrorException";
  }
}
