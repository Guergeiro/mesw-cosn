import { Controller } from "shared-controllers";

export class AuthSignInController implements Controller {
  public async handle(request: Request) {
    return new Response("hello", { status: 200 });
  }
}
