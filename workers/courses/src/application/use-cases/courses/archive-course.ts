import { Course } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { NotFoundException } from "shared-exceptions";
import { KafkaPublisher } from "shared-services";
import { UseCase } from "shared-use-cases";

type ArchiveCourseInput = Course["id"];

type ArchiveCourseOutput = void;

export class ArchiveCourse
  implements UseCase<ArchiveCourseInput, ArchiveCourseOutput>
{
  readonly #courseRepository: CourseRepository;
  readonly #kafkaPublisher: KafkaPublisher;

  public constructor(
    courseRepository: CourseRepository,
    kafkaPublisher: KafkaPublisher
  ) {
    this.#courseRepository = courseRepository;
    this.#kafkaPublisher = kafkaPublisher;
  }

  async execute(input: ArchiveCourseInput): Promise<ArchiveCourseOutput> {
    const course = await this.#courseRepository.findById(input);

    if (course == null) {
      throw new NotFoundException();
    }

    await this.#courseRepository.archive(input);

    await this.#kafkaPublisher.send({
      topic: "course",
      key: "archived",
      message: course.id,
    });
  }
}
