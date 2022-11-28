export class ForbiddenException extends Error {
  public constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenException";
  }
}
