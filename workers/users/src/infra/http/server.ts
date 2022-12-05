import { AuthSignInController } from "@adapters/auth/sign-in-controller";
import { CreateUserController } from "@adapters/users/create-user-controller";
import { UserCreateUser } from "@application/use-cases/users/create-user";
import { UsersPostgre } from "@infra/db/postgre";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ErrorHandler } from "shared-controllers";
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

server.post("/users", async function (c) {
  const { env, req } = c;
  const controller = new CreateUserController(
    new UserCreateUser(new UsersPostgre(env.DATABASE_ENDPOINT))
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
