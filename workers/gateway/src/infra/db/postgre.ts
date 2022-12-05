import { Host } from "@domain/entities/host";
import { HostsRepository } from "@domain/repositories/hosts";
import { PostgrestClient } from "@supabase/postgrest-js";

export class HostsPostgre implements HostsRepository {
  readonly #client: PostgrestClient;

  public constructor(postgreHost: string) {
    const postgreClient = new PostgrestClient(postgreHost, {
      fetch: (...args) => fetch(...args),
    });
    this.#client = postgreClient;
  }

  public async findByPathname(pathname: string) {
    const { data, error } = await this.#client
      .from("hosts")
      .select()
      .eq("pathname", pathname)
      .limit(1)
      .single();

    if (error != null) {
      return
    }

    return new Host(data);
  }
}
