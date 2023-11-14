export class ItemCollection<T> {
  private readonly items: Array<T>;

  private constructor(items: Array<T>) {
    this.items = items;
  }

  copy(): ItemCollection<T> {
    return new ItemCollection(Array.from(this.items));
  }
}
