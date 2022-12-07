import { User, UserFilters } from "@domain/entities/user";

export interface UsersRepository {
  find(filters?: UserFilters): Promise<Array<Pick<User, "id">>>;
  findById(id: User["id"]): Promise<User | undefined>
  findByEmail(email: User["email"]): Promise<User | undefined>;
  save(user: User): Promise<void>;
}
