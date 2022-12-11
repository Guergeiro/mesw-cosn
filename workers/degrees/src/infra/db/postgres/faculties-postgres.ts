import { Faculty } from "@domain/entities/faculty";
import { FacultyRepository } from "@domain/repositories/faculty";
import { PostgrestClient } from "@supabase/postgrest-js";
import { InternalServerErrorException } from "shared-exceptions";

export class FacultiesPostgres implements FacultyRepository {
  readonly #client: PostgrestClient;

  public constructor(postgresHost: string) {
    const postgresClient = new PostgrestClient(postgresHost, {
      fetch: (...args) => fetch(...args),
    });
    this.#client = postgresClient;
  }

  public async add(faculty: Faculty) {
    return faculty.persist(async (values) => {
      const { error } = await this.#client.from("faculties").insert(values);
      if (error != null) {
        throw new InternalServerErrorException(error.message);
      }
    });
  }

  public async findById(id: Faculty["id"]) {
    const { data, error } = await this.#client
      .from("faculties")
      .select()
      .eq("id", id)
      .limit(1)
      .single();

    if (error != null) {
      return;
    }

    return new Faculty(data);
  }

  public async delete(id: Faculty["id"]) {
    const { error } = await this.#client
      .from("faculties")
      .delete()
      .eq("id", id);

    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
