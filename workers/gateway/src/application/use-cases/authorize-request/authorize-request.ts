import { Host } from "@domain/entities/host";
import { HostsRepository } from "@domain/repositories/hosts";
import { JwtService } from "shared-services";
import {
  NotFoundException,
  PreconditionFailedException,
  UnauthorizedException,
} from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type AuthorizeRequestInput = {
  pathname: string;
  method: string;
  headers: Headers;
};

type AuthorizeRequestOutput = Host;

export class AuthorizeRequest
  implements UseCase<AuthorizeRequestInput, AuthorizeRequestOutput>
{
  readonly #hostsRepository: HostsRepository;
  readonly #jwtService: JwtService;

  public constructor(hostsRepository: HostsRepository, jwtService: JwtService) {
    this.#hostsRepository = hostsRepository;
    this.#jwtService = jwtService;
  }

  public async execute({ pathname, headers, method }: AuthorizeRequestInput) {
    const [_, firstPath] = pathname.split("/", 2);
    const host = await this.#hostsRepository.findByPathname(firstPath);

    if (host == null) {
      throw new NotFoundException();
    }

    if (method === "GET") {
      return host;
    }

    if (host.protected === false) {
      return host;
    }

    if (host.pathname === "users" && method === "POST") {
      return host;
    }

    const auth = headers.get("authorization");
    if (auth == null) {
      throw new UnauthorizedException();
    }
    const [basic, jwtToken] = auth.split(" ", 2);

    if (basic.toLowerCase() !== "bearer") {
      throw new PreconditionFailedException();
    }

    const payload = await this.#jwtService.verify(jwtToken);

    if (this.canAccess(pathname, method, payload.role as string) === false) {
      throw new UnauthorizedException();
    }

    return host;
  }

  private canAccess(pathname: string, method: string, role: string) {
    if (role === "admin") {
      return true;
    }

    switch (role) {
      case "faculty":
        return this.checkFaculty(pathname, method);
      case "student":
        return this.checkStudent(pathname, method);
    }

    return this.checkAnyRole(pathname, method);
  }

  private checkAnyRole(pathname: string, method: string) {
    switch (pathname) {
      case "degrees":
      case "courses":
        return false;
    }
    switch (method) {
      case "POST":
        return true;
    }
    return false;
  }

  private checkFaculty(pathname: string, method: string) {
    switch (pathname) {
      case "degrees":
      case "courses":
        return true;
    }
    switch (method) {
      case "PUT":
      case "PATCH":
        return true;
    }
    return false;
  }

  private checkStudent(pathname: string, method: string) {
    switch (pathname) {
      case "degrees":
      case "courses":
        return false;
    }
    switch (method) {
      case "PUT":
      case "PATCH":
        return true;
    }
    return false;
  }
}
