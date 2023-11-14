export class AssignedSeasonCounter {
  private readonly counter: Map<string, number>;

  static create(): AssignedSeasonCounter {
    return new AssignedSeasonCounter();
  }

  static from(data: Map<string, number>): AssignedSeasonCounter {
    return new AssignedSeasonCounter(data);
  }

  private constructor(counter?: Map<string, number>) {
    this.counter = counter || new Map<string, number>();
  }

  get(identifier: string): number {
    return this.counter.get(identifier) || 0;
  }

  set(identifier: string, count: number): AssignedSeasonCounter {
    const newCounter = new Map<string, number>(this.counter);
    newCounter.set(identifier, count);
    return new AssignedSeasonCounter(newCounter);
  }

  update(
    identifier: string,
    transform: (count: number) => number
  ): AssignedSeasonCounter {
    return this.set(identifier, transform(this.get(identifier)));
  }

  increment(identifier: string): AssignedSeasonCounter {
    return this.update(identifier, (count) => count + 1);
  }

  decrement(identifier: string): AssignedSeasonCounter {
    return this.update(identifier, (count) => Math.max(count - 1, 0));
  }

  decrementAll(identifiers: Array<string>): AssignedSeasonCounter {
    const newCounter = new Map<string, number>(this.counter);
    identifiers.forEach((identifier) => {
      const count = newCounter.get(identifier);
      if (count !== undefined && count > 1) {
        newCounter.set(identifier, count - 1);
      } else {
        newCounter.delete(identifier);
      }
    });
    return new AssignedSeasonCounter(newCounter);
  }
}
