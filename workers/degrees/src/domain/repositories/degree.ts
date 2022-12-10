import { Degree, DegreeFilters } from "@domain/entities/degree";

export interface DegreeRepository {
  add(degree: Degree): Promise<void>;
  find(filters?: DegreeFilters): Promise<Array<Pick<Degree, "id">>>;
  findById(id: Degree["id"]): Promise<Degree | undefined>;
  archive(id: Degree["id"]): Promise<void>;
}
