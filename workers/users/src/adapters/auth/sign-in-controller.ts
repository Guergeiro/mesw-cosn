import { generateSchema } from "@anatine/zod-openapi";
import { AuthSignIn } from "@application/use-cases/auth/sign-in";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signIn: PathItemObject = {
  post: {
    tags: ["auth"],
    responses: {
      "200": {
        description: "Access token to use.",
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
      "401": {
        description: "Unauthorized Exception.",
        content: {
          "application/json": {},
        },
      },
    },
    requestBody: {
      description: "SignIn to get a token.",
      content: {
        "application/json": {
          schema: generateSchema(bodyValidator),
        },
      },
    },
  },
};

export class AuthSignInController implements Controller {
  readonly #useCase: AuthSignIn;

  public constructor(useCase: AuthSignIn) {
    this.#useCase = useCase;
  }

  public async handle(request: Request) {
    const len = request.headers.get("content-length") || "0";
    if (len === "0") {
      throw new BadRequestException();
    }

    const parsed = bodyValidator.safeParse(await request.json());
    if (parsed.success === false) {
      throw new BadRequestException(parsed.error.message);
    }

    const token = await this.#useCase.execute(parsed.data);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(token), { status: 200, headers });
  }
}
