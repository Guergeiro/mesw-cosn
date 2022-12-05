import { jwtDecrypt, EncryptJWT } from "jose";
import { UnauthorizedException } from "shared-exceptions";

export class JwtService {
  readonly #authServicePublicKeyEndpoint: string;

  public constructor(authServicePublicKeyEndpoint: string) {
    this.#authServicePublicKeyEndpoint = authServicePublicKeyEndpoint;
  }

  public async generateJwt(payload: unknown, privateKey: Uint8Array) {
    const jwt = await new EncryptJWT({  })
      .setIssuedAt()
      .setExpirationTime("2h")
      .encrypt(privateKey);
    return jwt;
  }

  public async validateJwt(jwtToken: string) {
    const key = await this.getPublicKey();

    const { payload } = await jwtDecrypt(jwtToken, key);
    return payload;
  }

  private async getPublicKey() {
    const res = await fetch(this.#authServicePublicKeyEndpoint);
    if (res.ok !== true) {
      throw new UnauthorizedException();
    }
    const key = await res.arrayBuffer();
    return new Uint8Array(key);
  }
}
