export class User {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date
  ) {}

  static create(
    name: string,
    email: string,
    passwordHash: string
  ): Omit<User, 'id' | 'createdAt' | 'updatedAt'> {
    return {
      name,
      email,
      passwordHash,
    };
  }
}

