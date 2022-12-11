import { GetCourse } from "@application/use-cases/courses/get-course";
import { PathsObject } from "openapi3-ts";
import { Controller } from "shared-controllers";

export const getCourse: PathsObject = {
  get: {
    tags: ["courses"],
    responses: {
      "200": {
        description: "Get a course.",
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

export class GetCourseController implements Controller {
  readonly #useCase: GetCourse;

  public constructor(useCase: GetCourse) {
    this.#useCase = useCase;
  }

  public async handle(request: Request<"id">) {
    const { id } = request.param();

    const course = await this.#useCase.execute(id);

    const headers = new Headers();
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify(course), { status: 200, headers });
  }
}
