export class PreconditionFailedException extends Error {
  public constructor(message = "Precondition Failed") {
    super(message);
    this.name = "PreconditionFailedException";
  }
}
