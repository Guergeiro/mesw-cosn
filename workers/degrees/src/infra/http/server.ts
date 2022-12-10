import { ArchiveDegreeController } from "@adapters/degrees/archive-degree-controller";
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
import { ArchiveDegree } from "@application/use-cases/degrees/archive-degree";
import { CreateDegree } from "@application/use-cases/degrees/create-degree";
import { GetDegree } from "@application/use-cases/degrees/get-degree";
import { GetDegrees } from "@application/use-cases/degrees/get-degrees";
import { DegreesPostgres } from "@infra/db/postgres";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { OpenApiBuilder } from "openapi3-ts";
import { ErrorHandler, OpenApiHandler } from "shared-controllers";
import { LoggerService } from "shared-services";

type Env = {
  ENV: string;

  DATABASE_ENDPOINT: string;
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
      "/degrees/{degreeId}": { ...getDegree },
    },
  });

  const controller = new OpenApiHandler(builder);

  return await controller.handle(req);
});

server.post("/degrees", async function (c) {
  const { env, req } = c;

  const controller = new CreateController(
    new CreateDegree(new DegreesPostgres(env.DATABASE_ENDPOINT))
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

server.delete("/degrees/:id", async function (c) {
  const { env, req } = c;

  const controller = new ArchiveDegreeController(
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
