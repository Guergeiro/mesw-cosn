import { Faculty } from "@domain/entities/faculty";
import { FacultyRepository } from "@domain/repositories/faculty";
import { UseCase } from "shared-use-cases";

type CreateFacultyInput = {
  id: string;
};

type CreateFacultyOutput = void;

export class CreateFaculty
  implements UseCase<CreateFacultyInput, CreateFacultyOutput>
{
  readonly #facultyRepository: FacultyRepository;

  public constructor(facultyRepository: FacultyRepository) {
    this.#facultyRepository = facultyRepository;
  }

  async execute(input: CreateFacultyInput): Promise<CreateFacultyOutput> {
    const faculty = new Faculty({ ...input });
    await this.#facultyRepository.add(faculty);
  }
}
