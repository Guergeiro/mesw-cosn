import { Course } from "@domain/entities/course";
import { CourseRepository } from "@domain/repositories/course";
import { DegreeRepository } from "@domain/repositories/degree";
import { BadRequestException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type CreateCourseInput = {
  degreeId: string;
  code: string;
  name: string;
  description: string;
  abbr: string;
  ects: number;
  scientificArea: string;
};

type CreateCourseOutput = Course;

export class CreateCourse
  implements UseCase<CreateCourseInput, CreateCourseOutput>
{
  readonly #courseRepository: CourseRepository;
  readonly #degreeRepository: DegreeRepository;

  public constructor(
    courseRepository: CourseRepository,
    degreeRepository: DegreeRepository
  ) {
    this.#courseRepository = courseRepository;
    this.#degreeRepository = degreeRepository;
  }

  async execute(input: CreateCourseInput): Promise<CreateCourseOutput> {
    const degree = await this.#degreeRepository.findById(input.degreeId);
    if (degree == null) {
      throw new BadRequestException("DegreeId does not exist.");
    }

    const course = new Course({ ...input });
    await this.#courseRepository.add(course);

    // TODO: Publish to Kafka

    return course;
  }
}
