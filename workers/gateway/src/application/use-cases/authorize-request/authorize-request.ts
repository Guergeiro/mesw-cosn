import { Host } from "@domain/entities/host";
import { HostsRepository } from "@domain/repositories/hosts";
import { JwtService } from "shared-services";
import { NotFoundException, UnauthorizedException } from "shared-exceptions";
import { UseCase } from "shared-use-cases";

type AuthorizeRequestInput = {
  jwtToken: string;
  pathname: string;
  method: string;
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

  public async execute({ pathname, jwtToken, method }: AuthorizeRequestInput) {
    const [_, firstPath] = pathname.split("/", 2);
    const host = await this.#hostsRepository.findByPathname(firstPath);

    if (host == null) {
      throw new NotFoundException();
    }

    if (host.protected === false) {
      return host;
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

    if (method === "GET") {
      return true;
    }

    switch (role) {
      case "faculty":
        return this.checkFaculty(pathname, method);
      case "student":
        return this.checkStudent(pathname, method);
    }

    return true;
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
