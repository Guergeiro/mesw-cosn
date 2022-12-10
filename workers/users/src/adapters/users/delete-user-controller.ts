import { DeleteUser } from "@application/use-cases/users/delete-user";
import { PathsObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const deleteUser: PathsObject = {
  delete: {
    tags: ["users"],
    responses: {
      "204": {
        description: "Delete a user.",
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

export class DeleteUserController implements Controller {
  readonly #useCase: DeleteUser;

  public constructor(useCase: DeleteUser) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const { id } = request.param();

    await this.#useCase.execute(id);

    return new Response(null, { status: 204 });
  }
}
