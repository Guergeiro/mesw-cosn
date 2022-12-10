import { GetDegree } from "@application/use-cases/degrees/get-degree";
import { PathsObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const getDegree: PathsObject = {
  get: {
    tags: ["degrees"],
    responses: {
      "200": {
        description: "Get a degree.",
        content: {
          "application/json": {},
        },
      },
      "400": {
        description: "Bad Request Exception.",
        content: {
          "application/json": {},
        },
      },
      "404": {
        description: "Not Found Exception.",
        content: {
          "application/json": {},
        },
      },
    },
    parameters: [
      {
        name: "degreeId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
};

export class GetDegreeController implements Controller {
  readonly #useCase: GetDegree;

  public constructor(useCase: GetDegree) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const { id } = request.param();

    const degree = await this.#useCase.execute(id);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(degree), { status: 200, headers });
  }
}
