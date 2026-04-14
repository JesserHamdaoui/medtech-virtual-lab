export class Range {
  constructor(public readonly min: number, public readonly max: number) {}

  contains(value: number): boolean {
    return value >= this.min && value <= this.max;
  }
}
