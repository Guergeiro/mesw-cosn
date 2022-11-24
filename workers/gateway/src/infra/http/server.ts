import { ErrorHandler } from "@adapters/error-handler";
import { ProtectedController } from "@adapters/protected/protected-controller";
import { JwtService } from "@application/services/jwt";
import { LoggerService } from "@application/services/logger";
import { AuthorizeRequest } from "@application/use-cases/shared/authorize-request";
import { HostsMongo } from "@infra/db/mongo";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
  API_KEY: string;
  DB_HOST: string;
  DB_SOURCE: string;
  DB_NAME: string;
  DB_COLLECTION: string;

  AUTH_SERVICE: string;
  ENV: string;
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());
server.use("/degrees", async function (c) {
  const { env, req } = c;
  const controller = new ProtectedController(
    new AuthorizeRequest(new HostsMongo(env), new JwtService(env.AUTH_SERVICE))
  );
  const response = await controller.handle(req);
  return response;
});
server.use("/users", async function (c) {
  const { env, req } = c;
  const controller = new ProtectedController(
    new AuthorizeRequest(new HostsMongo(env), new JwtService(env.AUTH_SERVICE))
  );
  const response = await controller.handle(req);
  return response;
});
server.use("/courses", async function (c) {
  const { env, req } = c;
  const controller = new ProtectedController(
    new AuthorizeRequest(new HostsMongo(env), new JwtService(env.AUTH_SERVICE))
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
