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

  public async add(degree: Degree) {
    return degree.persist(async (values) => {
      const { error } = await this.#client.from("degrees").insert(values);
      if (error != null) {
        throw new InternalServerErrorException(error.message);
      }

      const { data } = await this.#client.from("degrees").select();

      console.log(data);
    });
  }

  public async findById(id: Degree["id"]) {
    const { data, error } = await this.#client
      .from("degrees")
      .select()
      .eq("id", id)
      .limit(1)
      .single();

    if (error != null) {
      return;
    }

    return new Degree(data);
  }

  public async delete(id: Degree["id"]) {
    const { error } = await this.#client.from("degrees").delete().eq("id", id);

    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }

    const { data } = await this.#client.from("degrees").select();

    console.log(data);
  }
}
