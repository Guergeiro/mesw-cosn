import { Degree } from "@domain/entities/degree";
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

  public async add(degree: Degree): Promise<void> {
    return degree.persist(async (values) => {
      const { error } = await this.#client.from("degrees").insert(values);
      if (error != null) {
        throw new InternalServerErrorException(error.message);
      }
    });
  }
}
