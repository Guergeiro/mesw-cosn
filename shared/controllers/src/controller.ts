export interface Controller {
  handle(request: Request): Promise<Response>;
}
