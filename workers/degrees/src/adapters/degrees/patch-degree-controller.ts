import { generateSchema } from "@anatine/zod-openapi";
import { PatchDegree } from "@application/use-cases/degrees/patch-degree";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";
import { BadRequestException } from "shared-exceptions";
import { z } from "zod";

const bodyValidator = z.object({
  description: z.string().max(2000).optional(),
  goals: z.string().max(2000).optional(),
  url: z.string().url().optional(),
  abbr: z.string().optional(),
});

export const patchDegree: PathItemObject = {
  patch: {
    tags: ["degrees"],
    responses: {
      "200": {
        description: "Updated degree.",
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
    requestBody: {
      description: "Patch information from a degree",
      content: {
        "application/json": {
          schema: generateSchema(bodyValidator),
        },
      },
    },
  },
};

export class PatchDegreeController implements Controller {
  readonly #useCase: PatchDegree;

  public constructor(useCase: PatchDegree) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id", z.infer<typeof bodyValidator>>) {
    const len = request.headers.get("content-length") || "0";
    if (len === "0") {
      throw new BadRequestException();
    }

    const parsed = bodyValidator.safeParse(await request.json());
    if (parsed.success === false) {
      throw new BadRequestException(parsed.error.message);
    }

    const { id } = request.param();

    const degree = await this.#useCase.execute({ id, props: parsed.data });

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(degree), { status: 200, headers });
  }
}
