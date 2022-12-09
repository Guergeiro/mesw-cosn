import { User, UserFilters } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { PostgrestClient } from "@supabase/postgrest-js";
import { InternalServerErrorException } from "shared-exceptions";

export class UsersPostgre implements UsersRepository {
  readonly #client: PostgrestClient;

  public constructor(postgreHost: string) {
    const postgreClient = new PostgrestClient(postgreHost, {
      fetch: (...args) => fetch(...args),
    });
    this.#client = postgreClient;
  }

  public async find(filters?: UserFilters) {
    let query = this.#client.from("users").select("id");

    for (const [key, value] of Object.entries(filters || {})) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error != null) {
      return [];
    }

    return data;
  }

  public async findByEmail(email: string) {
    const { data, error } = await this.#client
      .from("users")
      .select()
      .eq("email", email)
      .limit(1)
      .single();

    if (error != null) {
      return;
    }

    return new User(data);
  }

  public save(user: User) {
    return user.persist(async (values) => {
      const { error } = await this.#client.from("users").insert(values);
      if (error != null) {
        throw new InternalServerErrorException(error.message);
      }
    });
  }
}
