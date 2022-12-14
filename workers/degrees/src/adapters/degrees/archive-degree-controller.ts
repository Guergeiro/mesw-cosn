import { ArchiveDegree } from "@application/use-cases/degrees/archive-degree";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const archiveDegree: PathItemObject = {
  delete: {
    tags: ["degrees"],
    responses: {
      "204": {
        description: "Archive degree.",
      },
      "404": {
        description: "Not Found Exception.",
        content: {
          "application/json": {},
        },
      },
      "500": {
        description: "Internal Server Error.",
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
    security: [
      {
        bearerAuth: []
      }
    ]
  },
};

export class ArchiveDegreeController implements Controller {
  readonly #useCase: ArchiveDegree;

  public constructor(useCase: ArchiveDegree) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const { id } = request.param();

    await this.#useCase.execute(id);

    return new Response(null, { status: 204 });
  }
}
