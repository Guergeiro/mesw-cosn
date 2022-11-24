import { Host } from "@domain/entities/host";
import { NotFoundException } from "@domain/exceptions/NotFoundException";
import { HostsRepository } from "@domain/repositories/hosts";
import { z } from "zod";

const HostsSchema = z.object({
  _id: z.string(),
  pathname: z.string(),
  hostname: z.string(),
});

const DocumentSchema = z.object({
  document: HostsSchema.required(),
});

type HostsMongoProps = {
  API_KEY: string;
  DB_HOST: string;
  DB_SOURCE: string;
  DB_NAME: string;
  DB_COLLECTION: string;
};

export class HostsMongo implements HostsRepository {
  readonly #apiKey: string;
  readonly #dbHost: string;
  readonly #dbSource: string;
  readonly #dbName: string;
  readonly #dbCollection: string;

  public constructor({
    API_KEY,
    DB_HOST,
    DB_SOURCE,
    DB_NAME,
    DB_COLLECTION,
  }: HostsMongoProps) {
    this.#apiKey = API_KEY;
    if (DB_HOST.endsWith("/") === false) {
      DB_HOST = `${DB_HOST}/`;
    }
    this.#dbHost = DB_HOST;
    this.#dbSource = DB_SOURCE;
    this.#dbName = DB_NAME;
    this.#dbCollection = DB_COLLECTION;
  }
  public async findByPathname(pathname: string) {
    const headers = new Headers();
    headers.append("api-key", this.#apiKey);
    headers.append("content-type", "application/json");
    headers.append("accept", "application/json");

    const body = {
      dataSource: this.#dbSource,
      database: this.#dbName,
      collection: this.#dbCollection,
      filter: {
        pathname,
      },
    };

    const request = new Request(new URL("findOne", this.#dbHost).toString(), {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const res = await fetch(request);
    if (res.ok === false) {
      throw new NotFoundException();
    }

    const data = DocumentSchema.safeParse(await res.json());

    if (data.success === false) {
      throw new NotFoundException();
    }

    return new Host(data.data.document);
  }
}
