import { ProtectedController } from "@adapters/protected/protected-controller";
import { AuthorizeRequest } from "@application/use-cases/authorize-request/authorize-request";
import { HostsPostgre } from "@infra/db/postgre";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ErrorHandler } from "shared-controllers";
import { JwtService, LoggerService } from "shared-services";

type Env = {
  ENV: string;

  DATABASE_ENDPOINT: string;
  JWT_SECRET: string;
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());
server.all("*", async function (c) {
  const { env, req } = c;
  const controller = new ProtectedController(
    new AuthorizeRequest(
      new HostsPostgre(env.DATABASE_ENDPOINT),
      new JwtService(env.JWT_SECRET)
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
