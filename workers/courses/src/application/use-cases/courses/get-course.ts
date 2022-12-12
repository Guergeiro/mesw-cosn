import { Course } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type GetCourseInput = Course["id"];

type GetCourseOutput = Course;

export class GetCourse implements UseCase<GetCourseInput, GetCourseOutput> {
  readonly #courseRepository: CourseRepository;

  public constructor(courseRepository: CourseRepository) {
    this.#courseRepository = courseRepository;
  }

  public async execute(input: GetCourseInput) {
    const course = await this.#courseRepository.findById(input);
    if (course == null) {
      throw new NotFoundException();
    }
    return course;
  }
}
