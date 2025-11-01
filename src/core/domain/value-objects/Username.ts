export class Username {
  private constructor(readonly value: string) {}

  static create(username: string): Username {
    if (!this.validate(username)) {
      throw new Error('Invalid username');
    }
    return new Username(username);
  }

  private static validate(username: string): boolean {
    console.log(username, username.split(" ").length)
    return username.split(" ").length == 1
  }
}