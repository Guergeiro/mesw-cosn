import { ArchiveCourse } from "@application/use-cases/courses/archive-course";
import { PathItemObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const archiveCourse: PathItemObject = {
  delete: {
    tags: ["courses"],
    responses: {
      "204": {
        description: "Archive course.",
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
        name: "courseId",
        in: "path",
        required: true,
        schema: {
          type: "string",
        },
      },
    ],
  },
};

export class ArchiveCourseController implements Controller {
  readonly #useCase: ArchiveCourse;

  public constructor(useCase: ArchiveCourse) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const { id } = request.param();

    await this.#useCase.execute(id);

    return new Response(null, { status: 204 });
  }
}
