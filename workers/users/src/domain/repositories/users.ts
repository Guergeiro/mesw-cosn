import { User, UserFilters } from "@domain/entities/user";

export interface UsersRepository {
  find(filters?: UserFilters): Promise<Array<Pick<User, "id">>>;
  findByEmail(email: string): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
