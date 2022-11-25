import { ErrorHandler } from "@adapters/error-handler";
import { ProtectedController } from "@adapters/protected/protected-controller";
import { JwtService } from "@application/services/jwt";
import { LoggerService } from "@application/services/logger";
import { AuthorizeRequest } from "@application/use-cases/shared/authorize-request";
import { HostsPostgre } from "@infra/db/postgre";
import { Hono } from "hono";
import { cors } from "hono/cors";

type Env = {
  ENV: string;

  AUTH_ENDPOINT: string;
  DATABASE_ENDPOINT: string;
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());
server.all("*", async function (c) {
  const { env, req } = c;
  const controller = new ProtectedController(
    new AuthorizeRequest(
      new HostsPostgre(env.DATABASE_ENDPOINT),
      new JwtService(env.AUTH_ENDPOINT)
    )
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
