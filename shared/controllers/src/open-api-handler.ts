import { OpenApiBuilder } from "openapi3-ts";
import { Controller } from "./controller";

export class OpenApiHandler implements Controller {
  readonly #builder: OpenApiBuilder;

  public constructor(builder: OpenApiBuilder) {
    this.#builder = builder;
  }

  public async handle(request: Request) {
    const accept = request.headers.get("accept");
    const headers = new Headers();
    if (accept === "text/yaml") {
      headers.set("content-type", "text/yaml");
      return new Response(this.#builder.getSpecAsYaml(), {
        status: 200,
        headers,
      });
    }
    headers.set("content-type", "application/json");
    return new Response(this.#builder.getSpecAsJson(), {
      status: 200,
      headers,
    });
  }
}
