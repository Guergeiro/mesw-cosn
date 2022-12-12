import { Course } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type PatchCourseInput = {
  id: Course["id"];
  props: Partial<
    Pick<Course, "name" | "description" | "abbr" | "ects" | "scientificArea">
  >;
};

type PatchCourseOutput = Course;

export class PatchCourse
  implements UseCase<PatchCourseInput, PatchCourseOutput>
{
  readonly #courseRepository: CourseRepository;

  public constructor(courseRepository: CourseRepository) {
    this.#courseRepository = courseRepository;
  }

  async execute({ id, props }: PatchCourseInput): Promise<PatchCourseOutput> {
    const exists = await this.#courseRepository.findById(id);
    if (exists == null) {
      throw new NotFoundException();
    }

    const course = await this.#courseRepository.patch(id, props);
    return course;
  }
}
