import { User } from "@domain/entities/user";
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

  public async save({ id, email, password }: User) {
    const { error } = await this.#client
      .from("users")
      .insert({ id, email, password });
    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
