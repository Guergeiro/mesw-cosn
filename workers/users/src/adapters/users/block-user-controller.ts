import { BlockUser } from "@application/use-cases/users/block-user";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const blockUser: PathItemObject = {
  patch: {
    tags: ["users"],
    responses: {
      "204": {
        description: "Block a user.",
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
    security: [
      {
        bearerAuth: []
      }
    ]
  },
};

export class BlockUserController implements Controller {
  readonly #useCase: BlockUser;

  public constructor(useCase: BlockUser) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">): Promise<Response> {
    const { id } = request.param();

    await this.#useCase.execute(id);

    return new Response(null, { status: 204 });
  }
}
