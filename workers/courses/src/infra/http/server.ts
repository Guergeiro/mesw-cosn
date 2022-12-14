import {
  archiveCourse,
  ArchiveCourseController,
} from "@adapters/courses/archive-course-controller";
import {
  CreateController,
  createCourse,
} from "@adapters/courses/create-course-controller";
import {
  getCourse,
  GetCourseController,
} from "@adapters/courses/get-course-controller";
import {
  getCourses,
  GetCoursesController,
} from "@adapters/courses/get-courses-controller";
import {
  patchCourse,
  PatchCourseController,
} from "@adapters/courses/patch-course-controller";
import { KafkaHandlerController } from "@adapters/degrees/kafka-handler-controller";
import { ArchiveCourse } from "@application/use-cases/courses/archive-course";
import { CreateCourse } from "@application/use-cases/courses/create-course";
import { GetCourse } from "@application/use-cases/courses/get-course";
import { GetCourses } from "@application/use-cases/courses/get-courses";
import { PatchCourse } from "@application/use-cases/courses/patch-course";
import { ArchiveDegree } from "@application/use-cases/degrees/archive-degree";
import { CreateDegree } from "@application/use-cases/degrees/create-degree";
import { CoursesPostgres } from "@infra/db/postgres/courses-postgres";
import { DegreesPostgres } from "@infra/db/postgres/degrees-postgres";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { OpenApiBuilder } from "openapi3-ts";
import {
  ErrorHandler,
  OpenApiHandler,
  SwaggerUIHandler,
} from "shared-controllers";
import { KafkaPublisher, LoggerService } from "shared-services";

type Env = {
  ENV: string;

  DATABASE_ENDPOINT: string;
  KAFKA_PROXY_ENDPOINT: string;
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());

server.get("/courses/open-api", async function (c) {
  const { req } = c;
  const builder = OpenApiBuilder.create({
    openapi: "3.0.0",
    info: {
      title: "Courses OpenAPI 3.0",
      description:
        "This is the public API for the Courses microservice based on the OpenAPI 3.0 specification.",
      version: "1.0.0",
    },
    tags: [
      {
        name: "courses",
        description: "Everything about courses",
      },
    ],
    paths: {
      "/courses": { ...getCourses, ...createCourse },
      "/courses/{courseId}": { ...getCourse, ...patchCourse, ...archiveCourse },
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  });

  const controller = new OpenApiHandler(builder);

  return await controller.handle(req);
});

server.get("/courses/swagger-ui", async function (c) {
  const { req } = c;

  const controller = new SwaggerUIHandler("open-api");
  return await controller.handle(req);
});

server.post("/courses", async function (c) {
  const { env, req } = c;

  const controller = new CreateController(
    new CreateCourse(
      new CoursesPostgres(env.DATABASE_ENDPOINT),
      new DegreesPostgres(env.DATABASE_ENDPOINT),
      new KafkaPublisher(env.KAFKA_PROXY_ENDPOINT)
    )
  );

  const response = await controller.handle(req);
  return response;
});

server.get("/courses", async function (c) {
  const { env, req } = c;

  const controller = new GetCoursesController(
    new GetCourses(new CoursesPostgres(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);
  return response;
});

server.get("/courses/:id", async function (c) {
  const { env, req } = c;

  const controller = new GetCourseController(
    new GetCourse(new CoursesPostgres(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);
  return response;
});

server.patch("/courses/:id", async function (c) {
  const { env, req } = c;

  const controller = new PatchCourseController(
    new PatchCourse(new CoursesPostgres(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);
  return response;
});

server.delete("/courses/:id", async function (c) {
  const { env, req } = c;

  const controller = new ArchiveCourseController(
    new ArchiveCourse(
      new CoursesPostgres(env.DATABASE_ENDPOINT),
      new KafkaPublisher(env.KAFKA_PROXY_ENDPOINT)
    )
  );

  const response = await controller.handle(req);
  return response;
});

server.post("/degrees", async function (c) {
  const { env, req } = c;

  const controller = new KafkaHandlerController(
    new CreateDegree(new DegreesPostgres(env.DATABASE_ENDPOINT)),
    new ArchiveDegree(new DegreesPostgres(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);
  return response;
});

server.onError(function (err, c) {
  const { env } = c;
  const errorHandler = new ErrorHandler(new LoggerService(env.ENV));
  const response = errorHandler.handle(err);
  return response;
});
