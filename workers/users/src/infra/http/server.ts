import {
  AuthSignInController,
  signIn,
} from "@adapters/auth/sign-in-controller";
import {
  changeRole,
  ChangeRoleController,
} from "@adapters/users/change-role-controller";
import {
  blockUser,
  BlockUserController,
} from "@adapters/users/block-user-controller";
import {
  createUser,
  CreateUserController,
} from "@adapters/users/create-user-controller";
import {
  deleteUser,
  DeleteUserController,
} from "@adapters/users/delete-user-controller";
import {
  getUser,
  GetUserController,
} from "@adapters/users/get-user-controller";
import {
  getUsers,
  GetUsersController,
} from "@adapters/users/get-users-controller";
import {
  unBlockUser,
  UnblockUserController,
} from "@adapters/users/unblock-user-controller";
import {
  updateUser,
  UpdateUserController,
} from "@adapters/users/update-user-controller";
import { BlockUser } from "@application/use-cases/users/block-user";
import { CreateUser } from "@application/use-cases/users/create-user";
import { DeleteUser } from "@application/use-cases/users/delete-user";
import { GetUser } from "@application/use-cases/users/get-user";
import { GetUsers } from "@application/use-cases/users/get-users";
import { UnblockUser } from "@application/use-cases/users/unblock-user";
import { UpdateUser } from "@application/use-cases/users/update-user";
import { UsersPostgre } from "@infra/db/postgre";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { OpenApiBuilder } from "openapi3-ts";
import {
  ErrorHandler,
  OpenApiHandler,
  SwaggerUIHandler,
} from "shared-controllers";
import { JwtService, LoggerService } from "shared-services";
import { ChangeRole } from "@application/use-cases/users/change-role";
import { AuthSignIn } from "@application/use-cases/auth/sign-in";

type Env = {
  ENV: string;

  DATABASE_ENDPOINT: string;
  JWT_SECRET: string;
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());

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
        name: "auth",
        description: "Everything about authentication",
      },
      {
        name: "users",
        description: "Everything about users",
      },
    ],
    paths: {
      "/auth/sign-in": { ...signIn },
      "/users": { ...getUsers, ...createUser },
      "/users/{userId}": { ...getUser, ...deleteUser, ...updateUser },
      "/users/{userId}/ops/block": { ...blockUser },
      "/users/{userId}/ops/unblock": { ...unBlockUser },
      "/users/{userId}/ops/change-role": { ...changeRole },
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

server.get("/users/swagger-ui", async function (c) {
  const { req } = c;

  const controller = new SwaggerUIHandler("open-api");
  return await controller.handle(req);
});

server.post("/auth/sign-in", async function (c) {
  const { env, req } = c;
  const controller = new AuthSignInController(
    new AuthSignIn(
      new UsersPostgre(env.DATABASE_ENDPOINT),
      new JwtService(env.JWT_SECRET)
    )
  );
  const response = await controller.handle(req);
  return response;
});

server.patch("/users/:id/ops/change-role", async function (c) {
  const { env, req } = c;
  const controller = new ChangeRoleController(
    new ChangeRole(new UsersPostgre(env.DATABASE_ENDPOINT))
  );
  const response = await controller.handle(req);
  return response;
});

server.patch("/users/:id/ops/block", async function (c) {
  const { env, req } = c;
  const controller = new BlockUserController(
    new BlockUser(new UsersPostgre(env.DATABASE_ENDPOINT))
  );
  const response = await controller.handle(req);
  return response;
});

server.patch("/users/:id/ops/unblock", async function (c) {
  const { env, req } = c;
  const controller = new UnblockUserController(
    new UnblockUser(new UsersPostgre(env.DATABASE_ENDPOINT))
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

server.delete("/users/:id", async function (c) {
  const { env, req } = c;
  const controller = new DeleteUserController(
    new DeleteUser(new UsersPostgre(env.DATABASE_ENDPOINT))
  );
  const response = await controller.handle(req);
  return response;
});

server.patch("/users/:id", async function (c) {
  const { env, req } = c;
  const controller = new UpdateUserController(
    new UpdateUser(new UsersPostgre(env.DATABASE_ENDPOINT))
  );
  const response = await controller.handle(req);
  return response;
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

server.onError(function (err, c) {
  const { env } = c;
  const errorHandler = new ErrorHandler(new LoggerService(env.ENV));
  const response = errorHandler.handle(err);
  return response;
});
