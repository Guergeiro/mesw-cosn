import { Degree, DegreeFilters, DegreeProps } from "@domain/entities/degree";
import { DegreeStatusEnum } from "@domain/enums/degree.enum";
import { DegreeRepository } from "@domain/repositories/degree";
import { PostgrestClient } from "@supabase/postgrest-js";
import {
  BadRequestException,
  InternalServerErrorException,
} from "shared-exceptions";

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

    if (filters?.status == null) {
      query = query.eq("status", DegreeStatusEnum.IN_PROGRESS);
    }

    const { data, error } = await query;

    if (error != null) {
      return [];
    }

    return data;
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

  public async archive(id: Degree["id"]) {
    const { error } = await this.#client
      .from("degrees")
      .update({ status: DegreeStatusEnum.ARCHIVED })
      .eq("id", id);

    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async patch(
    id: Degree["id"],
    props: Partial<Pick<DegreeProps, "description" | "goals" | "url" | "abbr">>
  ) {
    const { data, error } = await this.#client
      .from("degrees")
      .update({ ...props })
      .eq("id", id)
      .select();

    if (error != null) {
      throw new BadRequestException(error.message);
    }

    if (data.length === 0) {
      throw new InternalServerErrorException();
    }

    return new Degree(data[0]);
  }
}
