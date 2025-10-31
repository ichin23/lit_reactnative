export class Username {
  private constructor(readonly value: string) {}

  static create(name: string): Username {
    if (!this.validate(name)) {
      throw new Error('Invalid username');
    }
    return new Username(name);
  }

  private static validate(name: string): boolean {
    return name.split(" ").length == 1
  }
}