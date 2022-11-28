export class UnauthorizedException extends Error {
  public constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedException";
  }
}
