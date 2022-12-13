import { jwtVerify, SignJWT } from "jose";
import { UnauthorizedException } from "shared-exceptions";

export class JwtService {
  readonly #secret: Uint8Array;

  public constructor(secret: string) {
    this.#secret = new TextEncoder().encode(secret);
  }

  public async sign(payload: Record<string, unknown>) {
    const jwt = await new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setIssuer("urn:auth-mesw-cosn")
      .setExpirationTime("2h")
      .sign(this.#secret);
    return jwt;
  }

  public async verify(jwtToken: string) {
    try {
      const { payload } = await jwtVerify(jwtToken, this.#secret, {
        issuer: "urn:auth-mesw-cosn",
      });
      return payload;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }
}
