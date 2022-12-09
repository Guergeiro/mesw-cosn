export class BadRequestException extends Error {
  public constructor(message = "Bad Request") {
    super(message);
    this.name = "BadRequestException";
  }
}
