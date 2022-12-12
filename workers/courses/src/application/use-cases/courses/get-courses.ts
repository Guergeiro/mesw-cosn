import { CourseFilters } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { UseCase } from "shared-use-cases";

type GetCoursesInput = undefined;

type GetCoursesOutput = string[];

export class GetCourses implements UseCase<GetCoursesInput, GetCoursesOutput> {
  readonly #courseRepository: CourseRepository;

  public constructor(courseRepository: CourseRepository) {
    this.#courseRepository = courseRepository;
  }

  public async execute(filter?: CourseFilters) {
    const courses = await this.#courseRepository.find(filter);
    return courses.map(function ({ id }) {
      return id;
    });
  }
}
