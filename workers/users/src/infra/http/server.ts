import { AuthSignInController } from "@adapters/auth/sign-in-controller";
import {
  createUser,
  CreateUserController,
} from "@adapters/users/create-user-controller";
import {
  getUser,
  GetUserController,
} from "@adapters/users/get-user-controller";
import {
  getUsers,
  GetUsersController,
} from "@adapters/users/get-users-controller";
import { CreateUser } from "@application/use-cases/users/create-user";
import { GetUser } from "@application/use-cases/users/get-user";
import { GetUsers } from "@application/use-cases/users/get-users";
import { UsersPostgre } from "@infra/db/postgre";
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

server.post("/auth/sign-in", async function (c) {
  const { req } = c;
  const controller = new AuthSignInController();
  const response = await controller.handle(req);
  return response;
});

server.get("/users/open-api", async function (c) {
  const { req } = c;
  const builder = OpenApiBuilder.create({
    openapi: "3.0.0",
    info: {
      title: "Users OpenAPI 3.0",
      description:
        "This is the public API for the Users microservice based on the OpenAPI 3.0 specification.",
      version: "1.0.0",
    },
    tags: [
      {
        name: "users",
        description: "Everything about users",
      },
    ],
    paths: {
      "/users": { ...getUsers, ...createUser },
      "/users/{userId}": { ...getUser },
    },
  });

  const controller = new OpenApiHandler(builder);

  return await controller.handle(req);
});

server.post("/users", async function (c) {
  const { env, req } = c;
  const controller = new CreateUserController(
    new CreateUser(new UsersPostgre(env.DATABASE_ENDPOINT))
  );

  const response = await controller.handle(req);
  return response;
});

server.get("/users", async function (c) {
  const { env, req } = c;
  const controller = new GetUsersController(
    new GetUsers(new UsersPostgre(env.DATABASE_ENDPOINT))
  );
  const response = await controller.handle(req);
  return response;
});

server.get("/users/:id", async function (c) {
  const { env, req } = c;
  const controller = new GetUserController(
    new GetUser(new UsersPostgre(env.DATABASE_ENDPOINT))
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
