import { User, UserFilters } from "@domain/entities/user";
import { UsersRepository } from "@domain/repositories/users";
import { PostgrestClient } from "@supabase/postgrest-js";
import {
  InternalServerErrorException,
  NotFoundException,
} from "shared-exceptions";

export class UsersPostgre implements UsersRepository {
  readonly #client: PostgrestClient;

  public constructor(postgreHost: string) {
    const postgreClient = new PostgrestClient(postgreHost, {
      fetch: (...args) => fetch(...args),
    });
    this.#client = postgreClient;
  }

  public async findById(id: User["id"]) {
    const { data, error } = await this.#client
      .from("users")
      .select()
      .eq("id", id)
      .limit(1)
      .single();

    if (error != null) {
      return;
    }

    return new User(data);
  }

  public async find(filters?: UserFilters) {
    let query = this.#client.from("users").select("id").eq("deleted", false);

    for (const [key, value] of Object.entries(filters || {})) {
      query = query.eq(key, value);
    }

    const { data, error } = await query;

    if (error != null) {
      return [];
    }

    return data;
  }

  public async findByEmail(email: User["email"]) {
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
      const { error } = await this.#client.from("users").upsert(values);
      if (error != null) {
        throw new InternalServerErrorException(error.message);
      }
    });
  }

  public async deleteById(id: User["id"]) {
    const { error, data } = await this.#client
      .from("users")
      .update({ deleted: true })
      .eq("deleted", false)
      .eq("id", id)
      .select();

    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }

    if (data.length === 0) {
      throw new NotFoundException();
    }
  }

  public async blockById(id: User["id"]) {
    const { error, data } = await this.#client
      .from("users")
      .update({ blocked: true })
      .eq("id", id)
      .select();

    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }

    if (data.length === 0) {
      throw new NotFoundException();
    }
  }

  public async unBlockById(id: User["id"]) {
    const { error, data } = await this.#client
      .from("users")
      .update({ blocked: false })
      .eq("id", id)
      .select();

    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }

    if (data.length === 0) {
      throw new NotFoundException();
    }
  }
}
