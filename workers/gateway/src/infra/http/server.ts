import { ProtectedController } from "@adapters/protected/protected-controller";
import { AuthorizeRequest } from "@application/use-cases/authorize-request/authorize-request";
import { HostsPostgre } from "@infra/db/postgre";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { ErrorHandler } from "shared-controllers";
import { JwtService, LoggerService } from "shared-services";

type FetchFn = (request: Request) => Promise<Response>;

type Env = {
  ENV: string;
  DATABASE_ENDPOINT: string;
  JWT_SECRET: string;

  users: { fetch: FetchFn };
  degrees: { fetch: FetchFn };
  courses: { fetch: FetchFn };
};

export const server = new Hono<{ Bindings: Env }>();
server.use(cors());
server.all("*", async function (c) {
  const { env, req } = c;
  async function fetchFn(request: Request, path: string) {
    if (env.ENV !== "development") {
      switch (path) {
        case "users":
        case "auth":
          return await env.users.fetch(request);
        case "degrees":
          return await env.degrees.fetch(request);
        case "courses":
          return await env.courses.fetch(request);
      }
    }
    return await fetch(request);
  }
  const controller = new ProtectedController(
    new AuthorizeRequest(
      new HostsPostgre(env.DATABASE_ENDPOINT),
      new JwtService(env.JWT_SECRET)
    ),
    fetchFn
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
