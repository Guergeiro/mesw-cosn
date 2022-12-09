import { Degree, DegreeFilters } from "@domain/entities/degree";
import { DegreeRepository } from "@domain/repositories/degree";
import { PostgrestClient } from "@supabase/postgrest-js";
import { InternalServerErrorException } from "shared-exceptions";

export class DegreesPostgres implements DegreeRepository {
  readonly #client: PostgrestClient;

  public constructor(postgresHost: string) {
    const postgresClient = new PostgrestClient(postgresHost, {
      fetch: (...args) => fetch(...args),
    });
    this.#client = postgresClient;
  }

  public async add(degree: Degree) {
    return degree.persist(async (values) => {
      const { error } = await this.#client.from("degrees").insert(values);
      if (error != null) {
        throw new InternalServerErrorException(error.message);
      }
    });
  }

  public async find(filters?: DegreeFilters) {
    let query = this.#client.from("degrees").select("id");

    for (const [key, value] of Object.entries(filters || {})) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error != null) {
      return [];
    }

    return data;
  }
}
