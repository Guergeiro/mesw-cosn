import { generateSchema } from "@anatine/zod-openapi";
import { ChangeRole } from "@application/use-cases/users/change-role";
import { Roles } from "@domain/entities/user";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  role: z.nativeEnum(Roles),
});

export const changeRole: PathItemObject = {
  patch: {
    tags: ["users"],
    responses: {
      "204": {
        description: "Change role of a user.",
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
    requestBody: {
      description: "Change role of a user",
      content: {
        "application/json": {
          schema: generateSchema(bodyValidator),
        },
      },
    },
  },
};

export class ChangeRoleController implements Controller {
  readonly #useCase: ChangeRole;

  public constructor(useCase: ChangeRole) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">): Promise<Response> {
    const len = request.headers.get("content-length") || "0";
    if (len === "0") {
      throw new BadRequestException();
    }

    const parsed = bodyValidator.safeParse(await request.json());

    if (parsed.success === false) {
      throw new BadRequestException(parsed.error.message);
    }

    const { id } = request.param();

    await this.#useCase.execute({ id, role: parsed.data.role });

    return new Response(null, { status: 204 });
  }
}
