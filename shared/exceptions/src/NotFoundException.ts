export class NotFoundException extends Error {
  public constructor(message = "Not Found") {
    super(message);
    this.name = "NotFoundException";
  }
}
