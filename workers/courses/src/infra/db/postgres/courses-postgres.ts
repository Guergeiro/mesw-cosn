import { CourseStatusEnum } from "@domain/enums/course.enum";
import { CourseRepository } from "@domain/repositories/course";
import { PostgrestClient } from "@supabase/postgrest-js";
import {
  BadRequestException,
  InternalServerErrorException,
} from "shared-exceptions";
import { Course, CourseFilters } from "../../../domain/entities/course";

export class CoursesPostgres implements CourseRepository {
  readonly #client: PostgrestClient;

  public constructor(postgresHost: string) {
    const postgresClient = new PostgrestClient(postgresHost, {
      fetch: (...args) => fetch(...args),
    });
    this.#client = postgresClient;
  }

  public async add(course: Course) {
    return course.persist(async (values) => {
      const { error } = await this.#client.from("courses").insert(values);
      if (error != null) {
        throw new InternalServerErrorException(error.message);
      }
    });
  }

  public async find(filters?: CourseFilters) {
    let query = this.#client.from("courses").select("id");

    for (const [key, value] of Object.entries(filters || {})) {
      query = query.eq(key, value);
    }

    if (filters?.status == null) {
      query = query.eq("status", CourseStatusEnum.IN_PROGRESS);
    }

    const { data, error } = await query;

    if (error != null) {
      return [];
    }

    return data;
  }

  public async findById(id: Course["id"]) {
    const { data, error } = await this.#client
      .from("courses")
      .select()
      .eq("id", id)
      .limit(1)
      .single();

    if (error != null) {
      return;
    }

    return new Course(data);
  }

  public async archive(id: Course["id"]) {
    const { error } = await this.#client
      .from("courses")
      .update({ status: CourseStatusEnum.ARCHIVED })
      .eq("id", id);

    if (error != null) {
      throw new InternalServerErrorException(error.message);
    }
  }

  public async patch(
    id: Course["id"],
    props: Partial<
      Pick<Course, "name" | "description" | "abbr" | "ects" | "scientificArea">
    >
  ) {
    const { data, error } = await this.#client
      .from("courses")
      .update({ ...props })
      .eq("id", id)
      .select();

    if (error != null) {
      throw new BadRequestException(error.message);
    }

    if (data.length === 0) {
      throw new InternalServerErrorException();
    }

    return new Course(data[0]);
  }
}
