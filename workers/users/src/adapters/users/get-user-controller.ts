import { GetUser } from "@application/use-cases/users/get-user";
import { PathsObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const getUser: PathsObject = {
  get: {
    tags: ["users"],
    responses: {
      "200": {
        description: "Get a user.",
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
        name: "userId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
};

export class GetUserController implements Controller {
  readonly #useCase: GetUser;

  public constructor(useCase: GetUser) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const { id } = request.param();

    const user = await this.#useCase.execute(id);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(user), { status: 200, headers });
  }
}
