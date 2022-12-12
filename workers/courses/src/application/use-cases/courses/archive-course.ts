import { Course } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { NotFoundException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type ArchiveCourseInput = Course["id"];

type ArchiveCourseOutput = void;

export class ArchiveCourse
  implements UseCase<ArchiveCourseInput, ArchiveCourseOutput>
{
  readonly #courseRepository: CourseRepository;

  public constructor(courseRepository: CourseRepository) {
    this.#courseRepository = courseRepository;
  }

  async execute(input: ArchiveCourseInput): Promise<ArchiveCourseOutput> {
    const course = await this.#courseRepository.findById(input);

    if (course == null) {
      throw new NotFoundException();
    }

    await this.#courseRepository.archive(input);

    // TODO: Publish to Kafka if status goes to ARCHIVED
  }
}
