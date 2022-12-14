import {
  archiveDegree,
  ArchiveDegreeController,
} from "@adapters/degrees/archive-degree-controller";
import {
  CreateController,
  createDegree,
} from "@adapters/degrees/create-degree-controller";
import {
  getDegree,
  GetDegreeController,
} from "@adapters/degrees/get-degree-controller";
import {
  getDegrees,
  GetDegreesController,
} from "@adapters/degrees/get-degrees-controller";
import {
  patchDegree,
  PatchDegreeController,
} from "@adapters/degrees/patch-degree-controller";
import { KafkaHandlerController } from "@adapters/faculties/kafka-handler-controller";
import { ArchiveDegree } from "@application/use-cases/degrees/archive-degree";
import { ArchiveDegreesByFacultyId } from "@application/use-cases/degrees/archive-degrees-by-facultyId";
import { CreateDegree } from "@application/use-cases/degrees/create-degree";
import { GetDegree } from "@application/use-cases/degrees/get-degree";
import { GetDegrees } from "@application/use-cases/degrees/get-degrees";
import { PatchDegree } from "@application/use-cases/degrees/patch-degree";
import { ArchiveFaculty } from "@application/use-cases/faculties/archive-faculty";
import { CreateFaculty } from "@application/use-cases/faculties/create-faculty";
import { DegreesPostgres } from "@infra/db/postgres/degrees-postgres";
import { FacultiesPostgres } from "@infra/db/postgres/faculties-postgres";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { OpenApiBuilder } from "openapi3-ts";
import {
  ErrorHandler,
  OpenApiHandler,
  SwaggerUIHandler,
} from "shared-controllers";
import { KafkaPublisher, ConsoleLogger, SentryLogger } from "shared-services";

type Env = {
  ENV: string;
  SENTRY_DSN: string;
  RELEASE: string;
  DATABASE_ENDPOINT: string;
  KAFKA_PROXY_ENDPOINT: string;
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());

server.get("/degrees/open-api", async function (c) {
  const { req } = c;
  const builder = OpenApiBuilder.create({
    openapi: "3.0.0",
    info: {
      title: "Degrees OpenAPI 3.0",
      description:
        "This is the public API for the Degrees microservice based on the OpenAPI 3.0 specification.",
      version: "1.0.0",
    },
    tags: [
      {
        name: "degrees",
        description: "Everything about degrees",
      },
    ],
    paths: {
      "/degrees": { ...getDegrees, ...createDegree },
      "/degrees/{degreeId}": { ...getDegree, ...patchDegree, ...archiveDegree },
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

server.get("/degrees/swagger-ui", async function (c) {
  const { req } = c;

  const controller = new SwaggerUIHandler("open-api");
  return await controller.handle(req);
});

server.post("/degrees", async function (c) {
  const { env, req } = c;

  const controller = new CreateController(
    new CreateDegree(
      new DegreesPostgres(env.DATABASE_ENDPOINT),
      new FacultiesPostgres(env.DATABASE_ENDPOINT),
      new KafkaPublisher(env.KAFKA_PROXY_ENDPOINT)
    )
  );

  const response = await controller.handle(req);

  return response;
});

server.get("/degrees", async function (c) {
  const { env, req } = c;

  const controller = new GetDegreesController(
    new GetDegrees(new DegreesPostgres(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);

  return response;
});

server.get("/degrees/:id", async function (c) {
  const { env, req } = c;

  const controller = new GetDegreeController(
    new GetDegree(new DegreesPostgres(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);

  return response;
});

server.patch("/degrees/:id", async function (c) {
  const { env, req } = c;

  const controller = new PatchDegreeController(
    new PatchDegree(new DegreesPostgres(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);
  return response;
});

server.delete("/degrees/:id", async function (c) {
  const { env, req } = c;

  const controller = new ArchiveDegreeController(
    new ArchiveDegree(
      new DegreesPostgres(env.DATABASE_ENDPOINT),
      new KafkaPublisher(env.KAFKA_PROXY_ENDPOINT)
    )
  );

  const response = await controller.handle(req);
  return response;
});

server.post("/faculties", async function (c) {
  const { env, req } = c;

  const controller = new KafkaHandlerController(
    new CreateFaculty(new FacultiesPostgres(env.DATABASE_ENDPOINT)),
    new ArchiveFaculty(new FacultiesPostgres(env.DATABASE_ENDPOINT)),
    new ArchiveDegreesByFacultyId(
      new DegreesPostgres(env.DATABASE_ENDPOINT),
      new KafkaPublisher(env.KAFKA_PROXY_ENDPOINT)
    )
  );

  const response = await controller.handle(req);
  return response;
});

server.onError(function (err, c) {
  const { env, req } = c;
  const errorHandler = new ErrorHandler(
    new SentryLogger(
      new ConsoleLogger(env.ENV),
      env.ENV,
      env.SENTRY_DSN,
      env.RELEASE
    )
  );
  const response = errorHandler.handle(err, req);
  return response;
});
