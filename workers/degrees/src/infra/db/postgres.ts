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

  public async add(degree: Degree): Promise<Degree> {
    const { data, error } = await this.#client
      .from("degrees")
      .insert({ ...degree.toPersistence })
      .select();

    if (error != null) {
      throw new InternalServerErrorException();
    }

    return new Degree(data[0]);
  }
}
