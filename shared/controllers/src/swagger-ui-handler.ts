import { Controller } from "./controller";

export class SwaggerUIHandler implements Controller {
  readonly #jsonEndpoint: string;

  public constructor(jsonEndpoint: string) {
    this.#jsonEndpoint = jsonEndpoint;
  }

  public async handle(_request: Request) {
    const headers = new Headers();
    headers.append("Content-Type", "text/html");
    return new Response(this.getUi(), { status: 200, headers });
  }

  private getUi() {
    const ui = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="description" content="SwaggerUI" /><title>SwaggerUI</title><link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" /></head><body><div id="swagger-ui"></div><script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js" crossorigin></script><script src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-standalone-preset.js" crossorigin></script><script>window.onload=()=>{window.ui=SwaggerUIBundle({url:'${this.#jsonEndpoint}',dom_id:'#swagger-ui'});};</script></body></html>`;
    return ui;
  }
}
