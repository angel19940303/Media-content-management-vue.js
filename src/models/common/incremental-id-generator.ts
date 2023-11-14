export class IncrementalIdGenerator {
  private idCount = 0;

  getAndIncrement(): number {
    const id = this.idCount;
    this.idCount++;
    return id;
  }

  reset(): void {
    this.idCount = 0;
  }
}
