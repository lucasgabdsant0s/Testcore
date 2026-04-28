export interface TokenPayload {
  userId: number;
  email: string;
}

export interface ITokenService {
  generate(payload: TokenPayload): string;
  verify(token: string): TokenPayload | null;
}

