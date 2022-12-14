import { generateSchema } from "@anatine/zod-openapi";
import { UpdateUser } from "@application/use-cases/users/update-user";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z
  .object({
    password: z.string().optional(),
    name: z.string().optional(),
  })
  .strict();

export const updateUser: PathItemObject = {
  patch: {
    tags: ["users"],
    responses: {
      "200": {
        description: "Get updated user.",
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
      description: "Update a user",
      content: {
        "application/json": {
          schema: generateSchema(bodyValidator),
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
};
export class UpdateUserController implements Controller {
  readonly #useCase: UpdateUser;

  public constructor(useCase: UpdateUser) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const len = request.headers.get("content-length") || "0";
    if (len === "0") {
      throw new BadRequestException();
    }

    const parsed = bodyValidator.safeParse(await request.json());

    if (parsed.success === false) {
      throw new BadRequestException(parsed.error.message);
    }

    const { id } = request.param();

    const user = await this.#useCase.execute({ id, ...parsed.data });
    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(user), { status: 200, headers });
  }
}
