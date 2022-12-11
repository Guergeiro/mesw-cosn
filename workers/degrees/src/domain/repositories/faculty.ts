import { Faculty } from "@domain/entities/faculty";

export interface FacultyRepository {
  add(faculty: Faculty): Promise<void>;
  findById(id: Faculty["id"]): Promise<Faculty | undefined>;
  delete(id: Faculty["id"]): Promise<void>;
}
