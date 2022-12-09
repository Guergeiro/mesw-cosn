import { CreateDegree } from "@application/use-cases/create-degree/create-degree";
import { DegreesPostgres } from "@infra/db/postgres";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ErrorHandler } from "shared-controllers";
import { LoggerService } from "shared-services";
import { CreateController } from "../../adapters/degree/create-controller";

type Env = {
  ENV: string;

  DATABASE_ENDPOINT: string;
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());

server.post("/degrees", async function (c) {
  const { env, req } = c;

  const controller = new CreateController(
    new CreateDegree(new DegreesPostgres(env.DATABASE_ENDPOINT))
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
