import { Degree, DegreeFilters } from "@domain/entities/degree";

export interface DegreeRepository {
  add(degree: Degree): Promise<void>;
  find(filters?: DegreeFilters): Promise<Array<Pick<Degree, "id">>>;
}