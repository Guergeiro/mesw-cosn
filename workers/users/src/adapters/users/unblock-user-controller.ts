import { UnblockUser } from "@application/use-cases/users/unblock-user";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const unBlockUser: PathItemObject = {
  patch: {
    tags: ["users"],
    responses: {
      "204": {
        description: "Unblock a user.",
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

export class UnblockUserController implements Controller {
  readonly #useCase: UnblockUser;

  public constructor(useCase: UnblockUser) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">): Promise<Response> {
    const { id } = request.param();

    await this.#useCase.execute(id);

    return new Response(null, { status: 204 });
  }
}
